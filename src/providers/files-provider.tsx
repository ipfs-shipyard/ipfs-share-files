import { CID } from 'multiformats/cid'
import React, { createContext, useEffect, useReducer } from 'react'
import { asyncItToFile } from '../components/file/utils/async-it-to-file.js'
import { getShareLink } from '../components/file/utils/get-share-link.js'
import { useHelia } from '../hooks/use-helia.js'
import { getWebRTCAddrs } from '../lib/share-addresses.js'

export interface AddFileState {
  id: string
  name: string
  size: number
  progress: number
  cid: CID
  published: false
  error?: undefined
}

export interface DownloadFileState {
  id: string
  name: string
  size: number
  progress: number
  cid: CID
  published: false
  error?: undefined
}

export interface FailedPublishFileState {
  id: string
  name: string
  size: number
  progress: number
  cid: CID
  published: false
  error: Error
}
export type FileState = AddFileState | DownloadFileState | FailedPublishFileState | {
  id: string
  name: string
  size: number
  progress: number
  cid: CID
  published: true
  error: Error | undefined
}

interface ShareLinkStateInit {
  link: null
  cid: null
}
interface ShareLinkStateOutdated {
  outdated: true
  link: null
  cid: null
}
interface ShareLinkStateValid {
  outdated: false
  link: string
  cid: CID
}
export type ShareLinkState = ShareLinkStateInit | ShareLinkStateOutdated | ShareLinkStateValid

export interface FetchStateInit {
  loading: false
  error: null
  cid: string
  filename: string | null
}

export interface FetchStateStart {
  loading: true
  error: null
  cid: string
  filename: string | null
}

export interface FetchStateError {
  loading: false
  error: Error
  cid: string | null
  filename: string | null
}

export interface FetchStateSuccess {
  loading: false
  error: null
  cid: string | null
  filename: string | null
}

export type FetchState = FetchStateInit | FetchStateStart | FetchStateError | FetchStateSuccess

export interface FileToFetch {
  cid: string
  filename: string | null
  fetching: boolean
}

export interface FilesToPublish {
  cid: CID
  publishing: boolean
}

export interface FilesState {
  filesToFetch: FileToFetch[]
  filesToPublish: FilesToPublish[]
  files: Record<string, FileState>
  shareLink: ShareLinkState
  // fetch: FetchState

  // whether or not the root CID (containing folder for all files) has been published
  rootPublished: boolean
}

export type FilesAction =
  | { type: 'add_start' } & AddFileState
  // | { type: 'add_upload' } & AddFileState
  | { type: 'add_success', id: string, cid: CID }
  | { type: 'add_fail', id: string, error: Error }

  | { type: 'publish_start', cid: CID }
  | { type: 'publish_in-progress', cid: CID }
  | { type: 'publish_cancelled', cid: CID }
  | { type: 'publish_success', cid: CID }
  | { type: 'publish_success_dir' }
  | { type: 'publish_reset_dir' }
  | { type: 'publish_fail', cid: CID, error: Error }

  | { type: 'share_link', link: string, cid: CID }

  | { type: 'fetch_start', cid: string, filename: string | null }
  | { type: 'fetch_in-progress', cid: string }
  | { type: 'fetch_cancelled', cid: string }
  | { type: 'fetch_success', files: Record<string, DownloadFileState> }
  | { type: 'fetch_success_dir', cid: string }
  | { type: 'fetch_fail', error: Error }

  | { type: 'reset_files' }

// eslint-disable-next-line complexity
function filesReducer (state: FilesState, action: FilesAction): FilesState {
  switch (action.type) {
    case 'add_start':
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            id: action.id,
            name: action.name,
            size: action.size,
            progress: action.progress,
            cid: action.cid,
            published: action.published
          }
        },
        shareLink: {
          outdated: true,
          link: null,
          cid: null
        }
      }

    case 'add_success':
      return {
        ...state,
        files: {
          ...state.files,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [action.id]: {
            ...state.files[action.id] satisfies FileState,
            cid: action.cid
          } as FileState
        },
        filesToPublish: [
          ...state.filesToPublish,
          { cid: action.cid, publishing: false } satisfies FilesToPublish
        ],
        shareLink: {
          outdated: true,
          link: null,
          cid: null
        }
      }

    case 'add_fail':
      return {
        ...state,
        files: {
          ...state.files,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [action.id]: {
            ...state.files[action.id],
            error: action.error
          } as FileState
        },
        shareLink: {
          ...state.shareLink,
          outdated: false
        }
      }

    case 'publish_start':
      // if the file is already in filesToPublish, we don't need to add it again
      if (state.filesToPublish.some(f => f.cid.equals(action.cid))) {
        return state
      }
      return {
        ...state,
        filesToPublish: [
          ...state.filesToPublish,
          { cid: action.cid, publishing: false } satisfies FilesToPublish
        ]
      }

    case 'publish_in-progress':
      return {
        ...state,
        filesToPublish: state.filesToPublish.map(f => {
          if (f.cid.equals(action.cid)) {
            return { ...f, publishing: true } satisfies FilesToPublish
          }
          return f
        })
      }

    case 'publish_cancelled':
      return {
        ...state,
        filesToPublish: state.filesToPublish.map(f => {
          if (f.cid.equals(action.cid)) {
            return { ...f, publishing: false } satisfies FilesToPublish
          }
          return f
        })
      }

    case 'publish_success':
      return {
        ...state,
        files: {
          ...state.files,
          [action.cid.toString()]: {
            ...state.files[action.cid.toString()],
            cid: action.cid,
            published: true
          }
        },
        // remove the file from filesToPublish
        filesToPublish: state.filesToPublish.filter(f => !f.cid.equals(action.cid))
      }

    case 'publish_reset_dir':
      return {
        ...state,
        rootPublished: false,
        shareLink: {
          outdated: true,
          link: null,
          cid: null
        }
      }

    case 'publish_success_dir':
      // when we've fully published a folder, we can remove the folder CID from filesToPublish
      return {
        ...state,
        rootPublished: true
      }

    case 'publish_fail':
      return {
        ...state,
        files: {
          ...state.files,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [action.cid.toString()]: {
            ...state.files[action.cid.toString()],
            error: action.error,
            published: false
          } satisfies FileState
        },
        // remove the file from filesToPublish
        filesToPublish: state.filesToPublish.filter(f => !f.cid.equals(action.cid))
      }

    case 'share_link':
      return {
        ...state,
        shareLink: {
          outdated: false,
          link: action.link,
          cid: action.cid
        }
      }

    case 'fetch_start':
      if (state.files[action.cid] != null) {
        // if files already contains the cid, we don't need to start fetching
        return state
      }
      return {
        ...state,
        filesToFetch: [
          ...state.filesToFetch,
          { cid: action.cid, filename: action.filename, fetching: false }
        ]
      }

    case 'fetch_in-progress':
      // mark the `fetching` flag as true
      return {
        ...state,
        filesToFetch: state.filesToFetch.map(f => {
          if (f.cid === action.cid) {
            return { ...f, fetching: true }
          }
          return f
        })
      }

    case 'fetch_cancelled':
      return {
        ...state,
        filesToFetch: state.filesToFetch.map(f => {
          if (f.cid === action.cid) {
            return { ...f, fetching: false }
          }
          return f
        })
      }

    case 'fetch_success':
      // add the fetched file to files and filesToPublish
      return {
        ...state,
        files: {
          ...state.files,
          ...action.files
        },
        filesToFetch: state.filesToFetch.filter(f => !Object.keys(action.files).includes(f.cid))
      }

    case 'fetch_success_dir':
      // when we've fully fetched a folder, we can remove the folder CID from filesToFetch
      return {
        ...state,
        filesToFetch: state.filesToFetch.filter(f => f.cid !== action.cid)
      }

    case 'fetch_fail':
      return {
        ...state
      }

    case 'reset_files':
      /**
       * on hash-change, we should empty out all files. This is handled by `useCurrentPage`, which calls
       * `setDownloadInfo` from download-provider.tsx
       *
       * Might be a race condition here depending on how quickly this action is dispatched vs setCid and setFilename
       * in download-provider.tsx
       */

      return initialState

    default:
      return state
  }
}

const initialState: FilesState = {
  filesToFetch: [],
  filesToPublish: [],
  files: {},
  rootPublished: false,
  shareLink: { link: null, cid: null }
}

export const FilesContext = createContext<FilesState>(initialState)
export const FilesDispatchContext = createContext<React.Dispatch<FilesAction>>(null as any)

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(filesReducer, initialState)
  // const [fetching, setFetching] = React.useState(false)
  const { mfs, unixfs, nodeInfo } = useHelia()
  const { filesToFetch, filesToPublish, files } = state

  /**
   * File Fetching Effect
   * Responsible for downloading files from IPFS when filesToFetch array changes.
   * - Skips if filesToFetch is empty or unixfs is not available
   * - For each file in filesToFetch:
   *   - Gets stats to determine if it's a file or directory
   *   - For files: downloads and dispatches fetch_success
   *   - For directories: downloads each file in the directory
   * - Adds downloaded files to publish queue
   * - Handles cancellation via AbortController
   */
  useEffect(() => {
    if (filesToFetch.length === 0) return
    if (unixfs == null) return
    const controller = new AbortController()

    const fetchFile = async ({ cid, filename, maddrs, fetching }: FileToFetch): Promise<void> => {
      if (fetching) return
      dispatch({ type: 'fetch_in-progress', cid })

      const cidInstance = CID.parse(cid)
      const unixfsStats = await unixfs.stat(cidInstance, {
        signal: controller.signal,
        onProgress: (evt) => {
          console.info(`unixfsStats progress "${evt.type}" detail:`, evt.detail)
        }
      })
      if (unixfsStats == null) {
        console.error('could not get unixfs stats for cid:', cid)
        return
      }

      if (unixfsStats.type !== 'directory') {
        // eslint-disable-next-line no-console
        console.log('its a file')
        const file = await asyncItToFile(unixfs.cat(cidInstance, {
          signal: controller.signal,
          onProgress: (evt) => {
            console.info(`download progress "${evt.type}" detail:`, evt.detail)
          }
        }), filename ?? cid.toString())
        dispatch({ type: 'fetch_success', files: { [cid]: { id: cid, name: file.name, size: file.size, progress: 0, cid: cidInstance, published: false } } })
      } else {
        for await (const entry of unixfs.ls(cidInstance)) {
          if (entry.type !== 'directory') {
            // eslint-disable-next-line no-console
            console.log(`fetching directory entry ${entry.cid}...`)
            const file = await asyncItToFile(unixfs.cat(entry.cid, {
              signal: controller.signal,
              onProgress: (evt) => {
                console.info(`download progress "${evt.type}" detail:`, evt.detail)
              }
            }), entry.name ?? filename ?? cid.toString())
            dispatch({ type: 'fetch_success', files: { [entry.cid.toString()]: { id: entry.cid.toString(), name: file.name, size: file.size, progress: 0, cid: entry.cid, published: false } } })
          } else {
            console.warn('directory entry found in directory, skipping...')
          }
        }
        dispatch({ type: 'fetch_success_dir', cid })
      }
    }

    const fetchAllFiles = async (): Promise<void> => {
      for (const fileToFetch of filesToFetch) {
        try {
          await fetchFile(fileToFetch)
          dispatch({ type: 'publish_start', cid: CID.parse(fileToFetch.cid) })
        } catch (e: any) {
          if (e.name === 'AbortError') {
            dispatch({ type: 'fetch_cancelled', cid: fileToFetch.cid.toString() })
            return
          }
          console.error('error fetching file:', e)
        }
      }
    }

    fetchAllFiles()
      .catch((err) => {
        console.error('error fetching files:', err)
      })
    // react mounts, unmounts, then re-mounts all components in dev mode on initial mount.
    // aborting the request here causes the fetch to be cancelled on re-mount
    return () => {
      controller.abort()
    }
  }, [unixfs, filesToFetch.map(f => f.cid.toString()).sort().join(',')])

  /**
   * File Publishing Effect
   * Handles publishing files to IPFS network when filesToPublish array changes.
   * - Skips if filesToPublish is empty, mfs unavailable, or all files already publishing
   * - For each unpublished file:
   *   - Provides the file to the IPFS network
   *   - Updates state on success/failure
   * - Handles cancellation via AbortController
   */
  useEffect(() => {
    if (filesToPublish.length === 0) return
    if (mfs == null) return
    if (filesToPublish.every(f => f.publishing)) return
    const controller = new AbortController()

    const publishFile = async ({ cid, publishing }: FilesToPublish): Promise<void> => {
      if (publishing) return
      dispatch({ type: 'publish_in-progress', cid })

      try {
        await helia.routing.provide(cid, {
          signal: controller.signal,
          onProgress: (evt) => {
            console.info(`file Publish progress "${evt.type}" detail:`, evt.detail)
          }
        })
        dispatch({ type: 'publish_success', cid })
      } catch (error: any) {
        dispatch({ type: 'publish_fail', cid, error })
      }
    }

    const publishAllFiles = async (): Promise<void> => {
      for (const fileToPublish of filesToPublish) {
        try {
          await publishFile(fileToPublish)
        } catch (e: any) {
          if (e.name === 'AbortError') {
            dispatch({ type: 'publish_cancelled', cid: fileToPublish.cid })
            return
          }
          console.error('error publishing file:', e)
        }
      }
    }
    publishAllFiles().catch((err) => {
      console.error('error publishing files:', err)
    })

    return () => {
      controller.abort()
    }
  }, [filesToPublish.map(f => f.cid.toString()).sort().join(','), mfs])

  /**
   * Root Directory Publishing Effect
   * Publishes the root directory after all individual files are processed.
   * - Triggers when filesToPublish and filesToFetch are empty (all files processed)
   * - Gets stats for root directory
   * - Generates and dispatches share link
   * - Publishes root directory to IPFS network
   * - Updates state to indicate root directory is published
   * - Handles cancellation via AbortController
   */
  useEffect(() => {
    if (mfs == null) return
    if (filesToPublish.length !== 0) return
    if (filesToFetch.length !== 0) return
    if (Object.values(files).length === 0) return
    const controller = new AbortController()

    const publishRoot = async (): Promise<void> => {
      // publish the folder root
      const rootStats = await mfs.stat('/', {
        signal: controller.signal,
        onProgress: (evt) => {
          console.info(`root folder stats progress "${evt.type}" detail:`, evt.detail)
        }
      })
      const link = getShareLink({ cid: rootStats.cid, webrtcMaddrs: getWebRTCAddrs(nodeInfo?.multiaddrs) })
      dispatch({ type: 'share_link', link, cid: rootStats.cid })
      await helia.routing.provide(rootStats.cid, {
        signal: controller.signal,
        onProgress: (evt) => {
          console.info(`root folder Publish progress "${evt.type}" detail:`, evt.detail)
        }
      })
      dispatch({ type: 'publish_success_dir' })
    }
    publishRoot().catch((err: any) => {
      if (err.name === 'AbortError') {
        dispatch({ type: 'publish_reset_dir' })
        return
      }
      console.error('error publishing folder root:', err)
    })

    return () => {
      controller.abort()
    }
  }, [filesToPublish.map(f => f.cid.toString()).sort().join(','), filesToFetch.map(f => f.cid.toString()).sort().join(','), mfs])

  return (
    <FilesContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  )
}
