import { createSelector } from 'redux-bundler'
import { filesToStreams, makeHashFromFiles, getDownloadLink } from '../lib/files'
import shortid from 'shortid'

const initialState = {
  files: {},
  shareLink: null,
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
          loading: true,
          files: {
            ...state.files,
            ...action.payload.file
          }
        }

      case 'FILES_ADD_PROGRESS':
        return {
          ...state,
          loading: true,
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
          loading: false,
          error: null
        }

      case 'FILES_ADD_FAILED':
        return {
          ...state,
          loading: false,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              pending: false,
              error: action.payload.error
            }
          }
        }

      case 'FILES_SHARE_LINK':
        return {
          ...state,
          shareLink: action.payload.shareLink
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
          }
        }

      case 'FILES_FETCH_FAILED':
        return {
          ...state,
          loading: true,
          files: {
            ...state.files,
            error: action.payload.error
          }
        }

      default:
        return state
    }
  },

  /* ============================================================
     Selectors
     ============================================================ */

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

  selectShareLink: state => state.files.shareLink,

  reactGetShareLink: createSelector(
    'selectExistFiles',
    'selectExistFilesPending',
    (existFiles, existFilesPending) => {
      if (existFiles && !existFilesPending) {
        return { actionCreator: 'doShareLink' }
      }
    }
  ),

  /* ============================================================
     Action Creators
     ============================================================ */

  doAddFiles: (files) => async ({ dispatch, store, getIpfs }) => {
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

      ipfs.add(stream, { pin: false, progress: updateProgress })
        .then(addedFile => dispatch({ type: 'FILES_ADD_FINISHED', payload: { id: fileId, hash: addedFile[0].hash } }))
        .catch(err => dispatch({ type: 'FILES_ADD_FAILED', payload: { id: fileId, error: err.message } }))
    }
  },

  doShareLink: () => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()
    const storeShareLink = store.selectShareLink()
    const files = Object.values(store.selectFiles())

    const multihash = await makeHashFromFiles(files, ipfs)

    const shareLink = `https://ipfs.io/ipfs/${multihash}`

    if (storeShareLink !== shareLink) {
      dispatch({ type: 'FILES_SHARE_LINK', payload: { shareLink: shareLink } })
    }
  },

  doFetchFileTree: (hash) => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()

    dispatch({ type: 'FILES_FETCH_STARTED' })

    ipfs.ls(hash)
      .then(ipfsFiles => {
        const files = {}

        for (const file of ipfsFiles) {
          const fileId = shortid.generate()
          const fileName = file.name
          const fileSize = file.size
          const fileHash = file.hash

          files[fileId] = {
            name: fileName,
            size: fileSize,
            hash: fileHash,
            progress: 100,
            pending: false
          }
        }
        dispatch({ type: 'FILES_FETCH_FINISHED', payload: { files: files } })
      })
      .catch(err => dispatch({ type: 'FILES_FETCH_FAILED', payload: { error: err.message } }))
  },

  doGetDownloadLink: (files) => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()
    dispatch({ type: 'FILES_GET_DOWNLOAD_LINK' })
    return getDownloadLink(files, ipfs)
  }
}
