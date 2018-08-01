import { filesToStreams } from '../lib/files'

const initialState = {
  files: [],
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
        return { ...state, loading: true }

      case 'FILES_ADD_FINISHED':
        return {
          ...state,
          files: [...state.files, action.payload.file],
          loading: false,
          error: null
        }

      case 'FILES_ADD_FAILED':
        return {
          ...state,
          loading: false,
          error: action.payload.error
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

  selectShareLink: state => state.files.shareLink,

  /* ============================================================
     Action Creators
     ============================================================ */

  doAddFiles: (files) => async ({ dispatch, store, state, getIpfs }) => {
    const ipfs = getIpfs()
    const { streams } = await filesToStreams(files)

    for (const stream of streams) {
      dispatch({ type: 'FILES_ADD_STARTED' })

      try {
        const addedFile = await ipfs.add(stream, { pin: false })

        const storeFile = {
          name: stream.name,
          size: addedFile[0].size,
          hash: addedFile[0].hash
        }

        dispatch({ type: 'FILES_ADD_FINISHED', payload: { file: storeFile } })
      } catch (e) {
        dispatch({ type: 'FILES_ADD_FAILED', payload: { error: e.message } })
      }
    }

    const storedFiles = store.selectFiles()

    let node = await ipfs.object.new('unixfs-dir')

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
