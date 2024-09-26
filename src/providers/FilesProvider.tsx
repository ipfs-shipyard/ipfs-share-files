import blobToIt from 'blob-to-it'
import { CID } from 'multiformats/cid'
import React, { createContext, useEffect, useReducer } from 'react'
import { getShareLink } from '../components/file/utils/get-share-link'
import { useHelia } from '../hooks/useHelia'

export interface AddFileState {
  id: string
  name: string
  size: number
  progress: number
  pending: true
  cid: null
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
export type FileState = AddFileState | {
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
  cid: null
  filename: null
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

export interface FilesState {
  files: Record<string, FileState>
  shareLink: ShareLinkState
  fetch: FetchState
}

export type FilesAction =
  | { type: 'add_start' } & AddFileState
  | { type: 'add_success', id: string, cid: CID }
  | { type: 'add_fail', id: string, error: Error }

  | { type: 'publish_start', id: string }
  | { type: 'publish_success', id: string, cid: CID }
  | { type: 'publish_fail', id: string, error: Error }

  | { type: 'share_link', link: string, cid: CID }

  | { type: 'fetch_start', cid: string, filename: string | null }
  | { type: 'fetch_success', files: Record<string, FileState> }
  | { type: 'fetch_fail', error: Error }

function filesReducer (state: FilesState, action: FilesAction): FilesState {
  // console.log('filesReducer', action)
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
            ...state.files[action.id],
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
      return {
        ...state,
        // @ts-expect-error - TODO: fix this
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            published: false
          }
        }
      }

    case 'publish_success':
      return {
        ...state,
        files: {
          ...state.files,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [action.id]: {
            ...state.files[action.id],
            published: true
          } as FileState
        }
      }

    case 'publish_fail':
      return {
        ...state,
        files: {
          ...state.files,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [action.id]: {
            ...state.files[action.id],
            error: action.error
          } as FileState
        }
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
      return {
        ...state,
        fetch: {
          cid: action.cid,
          filename: action.filename,
          loading: true,
          error: null
        }
      }

    case 'fetch_success':
      return {
        ...state,
        files: {
          ...state.files,
          ...action.files
        },
        fetch: {
          ...state.fetch,
          loading: false,
          error: null
        }
      }

    case 'fetch_fail':
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: false,
          error: action.error
        }
      }

    default:
      return state
  }
}

const initialState: FilesState = {
  files: {},
  shareLink: { link: null, cid: null },
  fetch: {
    cid: null,
    filename: null,
    loading: false,
    error: null
  }
}

export const FilesContext = createContext<FilesState>(initialState)
export const FilesDispatchContext = createContext<React.Dispatch<FilesAction>>(null as any)

export const FilesProvider = ({ children }): React.JSX.Element => {
  const [state, dispatch] = useReducer(filesReducer, initialState)
  const heliaState = useHelia()
  const { helia, mfs, unixfs } = heliaState

  // const doAddFiles = useAddFiles(dispatch, heliaState)

  console.log('filesProvider state.fetch:', state.fetch)
  useEffect(() => {
    if (helia == null || mfs == null || unixfs == null) return
    const fetchFiles = async (cid: CID, filename: string | null): Promise<void> => {
      console.log('fetching files...')
      // is the CID representing a single file or a directory?
      const unixfsStats = await unixfs.stat(cid)
      const bytes = await helia.blockstore.get(cid)

      const files: Array<{ cid: CID, file: File }> = []
      if (unixfsStats.type === 'file') {
        console.log('its a file')
        const file = new File([bytes], filename ?? cid.toString())
        files.push({ cid, file })
        // return {
        //   [cid.toString()]: {
        //     id: cid.toString(),
        //     name: filename ?? cid.toString(),
        //     size: file.size,
        //     progress: 0,
        //     pending: true,
        //     cid,
        //     published: false
        //   }
        // }
      } else {
        // it's a directory
        for await (const entry of unixfs.ls(cid)) {
          if (entry.type === 'file') {
            const bytes = await helia.blockstore.get(entry.cid)
            const realFile = new File([bytes], entry.name)
            files.push({ file: realFile, cid: entry.cid })
            console.log('created file...')
          }
        }
      }
      for (const { file: _file, cid } of files) {
        const id = cid.toString()
        const name = _file.name

        const file: AddFileState = {
          id,
          name,
          size: _file.size,
          progress: 0,
          cid: null,
          pending: true,
          published: false
        }

        Promise.resolve().then(async () => {
          dispatch({ type: 'add_start', ...file })
          const content = blobToIt(_file)
          await mfs.writeByteStream(content, name)
          const { cid } = await mfs.stat(`/${name}`)
          dispatch({ type: 'add_success', id, cid })
          return cid
        }).catch((err: Error) => {
          console.error(err)
          dispatch({ type: 'add_fail', id, error: err })
          throw err
        }).then(async (cid) => {
          dispatch({ type: 'publish_start', id })
          await helia.routing.provide(cid, {
            onProgress: (evt) => {
              console.info(`Publish progress "${evt.type}" detail:`, evt.detail)
            }
          })
          dispatch({ type: 'publish_success', id, cid })
        }).catch((err: Error) => {
          console.error(err)
          dispatch({ type: 'publish_fail', id, error: err })
        })
      }
      // return files

      // fetchFiles
    }
    if (state.fetch.cid != null && state.fetch.loading) {
      fetchFiles(CID.parse(state.fetch.cid), state.fetch.filename).then((files) => {
        // dispatch({ type: 'fetch_success', files })
      }).catch((err) => {
        dispatch({ type: 'fetch_fail', error: err })
      })
    }
  }, [state.fetch, helia, mfs, unixfs])

  // we need to update the share link whenever the files change
  useEffect(() => {
    const files = Object.values(state.files)
    const publishedFiles = files.filter(f => f.published)
    if (publishedFiles.length !== 0) {
      const cid = publishedFiles[0].cid
      if (cid != null) {
        const link = getShareLink(cid)
        // eslint-disable-next-line no-console
        console.log('share link', link)
        dispatch({ type: 'share_link', link, cid })
      }
    }
  }, [state.files])

  return (
    <FilesContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  )
}
