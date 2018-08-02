import { createSelector } from 'redux-bundler'
import { filesToStreams } from '../lib/files'
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
              error: action.payload.error
            }
          }
        }

      case 'FILES_SHARE_LINK':
        return {
          ...state,
          shareLink: action.payload.shareLink
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
    'selectShareLink',
    (existFiles, existFilesPending, existShareLink) => {
      if (existFiles && !existFilesPending && !existShareLink) {
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

    let node = await ipfs.object.new('unixfs-dir')
    const storedFiles = Object.values(store.selectFiles())

    for (const file of storedFiles) {
      node = await ipfs.object.patch.addLink(node.toJSON().multihash, {
        name: file.name,
        size: file.size,
        multihash: file.hash
      })
    }

    const multihash = node.toJSON().multihash
    const shareLink = `https://ipfs.io/ipfs/${multihash}`

    dispatch({ type: 'FILES_SHARE_LINK', payload: { shareLink: shareLink } })
  }
}
