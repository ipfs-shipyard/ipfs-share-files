import { CID } from 'multiformats/cid'
import React, { createContext, useEffect, useReducer } from 'react'
import { asyncItToFile } from '../components/file/utils/async-it-to-file.js'
import { getShareLink } from '../components/file/utils/get-share-link.js'
import { useHelia } from '../hooks/use-helia.js'

export interface AddFileState {
  id: string
  name: string
  size: number
  progress: number
  pending: true
  cid: CID
  published: false
  error?: undefined
}

export interface DownloadFileState {
  id: string
  name: string
  size: number
  progress: number
  pending: true
  cid: CID
  published: false
  error?: undefined
}

export interface FailedPublishFileState {
  id: string
  name: string
  size: number
  progress: number
  pending: false
  cid: CID
  published: false
  error: Error
}
export type FileState = AddFileState | DownloadFileState | FailedPublishFileState | {
  id: string
  name: string
  size: number
  progress: number
  pending: false
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
  | { type: 'publish_success', cid: CID }
  | { type: 'publish_success_dir', cid: CID }
  | { type: 'publish_fail', cid: CID, error: Error }

  | { type: 'share_link', link: string, cid: CID }

  | { type: 'fetch_start', cid: string, filename: string | null }
  | { type: 'fetch_in-progress', cid: string }
  | { type: 'fetch_success', files: Record<string, DownloadFileState> }
  | { type: 'fetch_success_dir', cid: string }
  | { type: 'fetch_fail', error: Error }

  | { type: 'reset_files' }

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
            pending: action.pending,
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
            pending: false,
            cid: action.cid
          } as FileState
        },
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
            pending: false,
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
        filesToPublish: state.filesToPublish.map(f => ({ ...f, publishing: true } satisfies FilesToPublish))
      }

    case 'publish_success':
      return {
        ...state,
        files: {
          ...state.files,
          [action.cid.toString()]: {
            ...state.files[action.cid.toString()],
            cid: action.cid,
            published: true,
            pending: false
          }
        },
        // remove the file from filesToPublish
        filesToPublish: state.filesToPublish.filter(f => !f.cid.equals(action.cid))
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
            pending: false,
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
  const { helia, mfs, unixfs } = useHelia()
  const { filesToFetch, filesToPublish } = state

  useEffect(() => {
    if (filesToFetch.length === 0) return
    if (unixfs == null) return
    const fetchFile = async ({ cid, filename, fetching }: FileToFetch): Promise<void> => {
      if (fetching) return
      dispatch({ type: 'fetch_in-progress', cid })

      // eslint-disable-next-line no-console
      console.log(`fetching ${cid}...`)
      // is the CID representing a single file or a directory?
      const cidInstance = CID.parse(cid)
      const unixfsStats = await unixfs.stat(cidInstance)
      // eslint-disable-next-line no-console
      console.log('unixfsStats:', unixfsStats)

      if (unixfsStats.type !== 'directory') {
        // eslint-disable-next-line no-console
        console.log('its a file')
        const file = await asyncItToFile(unixfs.cat(cidInstance, {
          onProgress: (evt) => {
            console.info(`download progress "${evt.type}" detail:`, evt.detail)
          }
        }), filename ?? cid.toString())
        dispatch({ type: 'fetch_success', files: { [cid]: { id: cid, name: file.name, size: file.size, progress: 0, pending: true, cid: cidInstance, published: false } } })
      } else {
        // eslint-disable-next-line no-console
        console.log('it\'s a directory')
        for await (const entry of unixfs.ls(cidInstance)) {
          if (entry.type !== 'directory') {
            // eslint-disable-next-line no-console
            console.log(`fetching ${entry.cid}...`)
            const file = await asyncItToFile(unixfs.cat(entry.cid, {
              onProgress: (evt) => {
                console.info(`download progress "${evt.type}" detail:`, evt.detail)
              }
            }), entry.name ?? filename ?? cid.toString())
            dispatch({ type: 'fetch_success', files: { [entry.cid.toString()]: { id: entry.cid.toString(), name: file.name, size: file.size, progress: 0, pending: true, cid: entry.cid, published: false } } })

            // eslint-disable-next-line no-console
            console.log('created file...')
          }
        }
        dispatch({ type: 'fetch_success_dir', cid })
      }
    }
    void Promise.all(filesToFetch.map(async (fileToFetch) => {
      return fetchFile(fileToFetch)
    })).catch((err) => {
      console.error('error fetching files:', err)
    }).then(async () => {
      console.info('done fetching files')
    })
  }, [unixfs, filesToFetch])

  /**
   * Any files that have published=false should be added to filesToPublish
   * if they are not already in filesToPublish
   */
  useEffect(() => {
    const files = Object.values(state.files)
    const filesToPublishToAdd = files.filter(f => !f.published)
    if (filesToPublishToAdd.length === 0) return

    for (const { cid } of filesToPublishToAdd) {
      if (filesToPublish.some(f => f.cid.equals(cid))) {
        // file is already in filesToPublish
        continue
      }
      dispatch({ type: 'publish_start', cid })
    }
  }, [filesToPublish, state.files])

  useEffect(() => {
    if (filesToPublish.length === 0) return
    if (mfs == null) return
    if (filesToPublish.every(f => f.publishing)) return

    const publishFile = async ({ cid, publishing }: FilesToPublish): Promise<void> => {
      if (publishing) return
      dispatch({ type: 'publish_in-progress', cid })

      // eslint-disable-next-line no-console
      console.log(`publishing ${cid}...`)
      try {
        await helia.routing.provide(cid, {
          onProgress: (evt) => {
            console.info(`file Publish progress "${evt.type}" detail:`, evt.detail)
          }
        })
        dispatch({ type: 'publish_success', cid })
      } catch (error: any) {
        dispatch({ type: 'publish_fail', cid, error })
      }
    }
    void Promise.all(filesToPublish.map(async (fileToPublish) => {
      if (fileToPublish.publishing) return
      await publishFile(fileToPublish)
    })).catch((err) => {
      console.error('error publishing files:', err)
    }).then(async () => {
      // publish the folder root
      try {
        const rootStats = await mfs.stat('/')
        const link = getShareLink(rootStats.cid)
        dispatch({ type: 'share_link', link, cid: rootStats.cid })
        await helia.routing.provide(rootStats.cid, {
          onProgress: (evt) => {
            console.info(`root folder Publish progress "${evt.type}" detail:`, evt.detail)
          }
        })
        dispatch({ type: 'publish_success_dir', cid: rootStats.cid })
      } catch (err: any) {
        console.error('error publishing folder root:', err)
      }
    })
  }, [filesToPublish, mfs])

  return (
    <FilesContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  )
}