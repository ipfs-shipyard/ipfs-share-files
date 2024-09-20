import { CID } from 'multiformats/cid'
import { createContext, useReducer } from 'react'

export type AddFileState = {
  id: string
  name: string
  size: number
  progress: number
  pending: true
  cid: null
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
  published: boolean
  error: Error | undefined
}

export type ShareLinkState = {
  outdated: false
  link: string
  cid: CID
} | {
  outdated: true
  link: null
  cid: null
}

export type FetchState = {
  loading: boolean
  error: Error | null
}

export type FilesState = {
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

  | { type: 'fetch_start' }
  | { type: 'fetch_success', files: Record<string, FileState> }
  | { type: 'fetch_fail', error: Error }

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
        }
      }

    case 'add_success':
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            pending: false,
            cid: action.cid
          } as FileState
        }
      }

    case 'add_fail':
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            pending: false,
            error: action.error
          } as FileState
        }
      }

    case 'publish_start':
      return {
        ...state,
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
          loading: true,
          error: null
        }
      }

    case 'fetch_success':
      return {
        ...state,
        files: {
          ...state.files,
          ...action.files,
        },
        fetch: {
          ...state.fetch,
          loading: false
        }
      }

    case 'fetch_fail':
      return {
        ...state,
        fetch: {
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
  shareLink: { outdated: true, link: null, cid: null },
  fetch: {
    loading: false,
    error: null
  }
}

export const FilesContext = createContext<FilesState>(initialState)
export const FilesDispatchContext = createContext<React.Dispatch<FilesAction>>(null as any)

export const FilesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filesReducer, initialState)

  return (
    <FilesContext.Provider value={state}>
      <FilesDispatchContext.Provider value={dispatch}>
        {children}
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  )
}