import { createSelector } from 'redux-bundler'
import shortid from 'shortid'
import { filesToStreams, makeHashFromFiles, getDownloadLink } from '../lib/files'
import ENDPOINTS from '../constants/endpoints'
import PAGES from '../constants/pages'

const initialState = {
  files: {},
  shareLink: {
    outdated: false,
    link: null
  },
  loading: false,
  error: null
}

export default {
  name: 'files',
  actionBaseType: 'FILES',

  /* ============================================================
     Reducer
     ============================================================ */

  reducer: (state = initialState, action) => {
    switch (action.type) {
      case 'FILES_ADD_STARTED':
        return {
          ...state,
          files: {
            ...state.files,
            ...action.payload.file
          }
        }

      case 'FILES_ADD_PROGRESS':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              progress: action.payload.progress
            }
          }
        }

      case 'FILES_ADD_FINISHED':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              hash: action.payload.hash,
              pending: false
            }
          },
          shareLink: {
            ...state.shareLink,
            outdated: true
          },
          error: null
        }

      case 'FILES_ADD_FAILED':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              pending: false,
              error: action.payload.error
            }
          },
          shareLink: {
            ...state.shareLink,
            outdated: false
          }
        }

      case 'FILES_SHARE_LINK':
        return {
          ...state,
          shareLink: {
            ...state.shareLink,
            link: action.payload.link,
            outdated: false
          }
        }

      case 'FILES_FETCH_STARTED':
        return {
          ...state,
          loading: true
        }

      case 'FILES_FETCH_FINISHED':
        return {
          ...state,
          loading: false,
          files: {
            ...state.files,
            ...action.payload.files
          },
          shareLink: {
            ...state.shareLink,
            outdated: true
          }
        }

      case 'FILES_FETCH_FAILED':
        return {
          ...state,
          loading: false,
          files: {
            ...state.files,
            error: action.payload.error
          },
          shareLink: {
            ...state.shareLink,
            outdated: false
          }
        }

      case 'FILES_RESET':
        return initialState

      default:
        return state
    }
  },

  /* ============================================================
     Selectors
     ============================================================ */

  selectIsLoading: state => state.files.loading,

  selectFiles: state => state.files.files,

  selectExistFiles: createSelector(
    'selectFiles',
    (files) => Object.keys(files).length
  ),

  selectPendingFiles: createSelector(
    'selectFiles',
    (files) => Object.values(files).filter((file) => file.pending)
  ),

  selectExistFilesPending: createSelector(
    'selectPendingFiles',
    (pendingFiles) => pendingFiles.length
  ),

  selectShareLink: state => state.files.shareLink.link,

  selectIsShareLinkOutdated: state => state.files.shareLink.outdated,

  reactGetShareLink: createSelector(
    'selectIsShareLinkOutdated',
    'selectCurrentPage',
    'selectExistFiles',
    'selectExistFilesPending',
    (isShareLinkOutdated, currentPage, existFiles, existFilesPending) => {
      if (currentPage === PAGES.upload && isShareLinkOutdated && existFiles && !existFilesPending) {
        return { actionCreator: 'doShareLink' }
      }
    }
  ),

  /* ============================================================
     Action Creators
     ============================================================ */

  doAddFiles: (files) => async ({ dispatch, getIpfs }) => {
    const ipfs = getIpfs()
    const { streams } = await filesToStreams(files)

    for (const stream of streams) {
      const fileId = shortid.generate()
      const fileName = stream.name
      const fileSize = stream.size

      const file = {
        [fileId]: {
          name: fileName,
          size: fileSize,
          progress: 0,
          pending: true
        }
      }

      dispatch({ type: 'FILES_ADD_STARTED', payload: { file: file } })

      const updateProgress = (bytesLoaded) => {
        const progress = Math.round((bytesLoaded / fileSize) * 100)

        dispatch({ type: 'FILES_ADD_PROGRESS', payload: { id: fileId, progress: progress } })
      }

      try {
        const addedFile = await ipfs.add(stream, { pin: false, progress: updateProgress })
        dispatch({ type: 'FILES_ADD_FINISHED', payload: { id: fileId, hash: addedFile[0].hash } })
      } catch (err) {
        dispatch({ type: 'FILES_ADD_FAILED', payload: { id: fileId, error: err.message } })
      }
    }
  },

  doShareLink: () => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()
    const storeShareLink = store.selectShareLink()
    const files = Object.values(store.selectFiles())

    const multihash = await makeHashFromFiles(files, ipfs)

    const shareLink = `${ENDPOINTS.gateway}/${multihash}`

    if (storeShareLink !== shareLink) {
      dispatch({ type: 'FILES_SHARE_LINK', payload: { link: shareLink } })
    }
  },

  doFetchFileTree: (hash) => async ({ dispatch, store, getIpfs }) => {
    let ipfsFiles
    let files = {}

    dispatch({ type: 'FILES_FETCH_STARTED' })

    try {
      // determines whether to use the public gateway or the user's node.
      if (store.selectIpfsReady()) {
        const ipfs = getIpfs()
        ipfsFiles = await ipfs.ls(hash)
      } else {
        const url = `${ENDPOINTS.api}/v0/ls?arg=${hash}`
        const res = await window.fetch(url)
        const objs = await res.json()
        ipfsFiles = objs.Objects[0].Links
      }

      for (const file of ipfsFiles) {
        const fileName = file.name || file.Name
        const fileSize = file.size || file.Size
        const fileHash = file.hash || file.Hash

        files[fileName] = {
          name: fileName,
          size: fileSize,
          hash: fileHash,
          progress: 100,
          pending: false
        }
      }

      dispatch({ type: 'FILES_FETCH_FINISHED', payload: { files: files } })
    } catch (err) {
      dispatch({ type: 'FILES_FETCH_FAILED', payload: { error: err.message } })
    }
  },

  doGetDownloadLink: (files) => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()
    dispatch({ type: 'FILES_GET_DOWNLOAD_LINK' })
    return getDownloadLink(files, ipfs)
  },

  doResetFiles: () => ({ dispatch }) => dispatch({ type: 'FILES_RESET' })
}
