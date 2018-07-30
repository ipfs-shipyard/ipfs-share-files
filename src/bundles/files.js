import { filesToStreams } from '../lib/files'

const initialState = {
  files: [],
  loading: false,
  error: null
}

export default {
  name: 'files',
  actionBaseType: 'FILES',

  reducer: (state = initialState, action) => {
    if (action.type === 'FILES_ADD_STARTED') {
      return { ...state, loading: true }
    }

    if (action.type === 'FILES_ADD_FINISHED') {
      return {
        ...state,
        files: action.payload.files,
        loading: false,
        error: null
      }
    }

    if (action.type === 'FILES_ADD_FAILED') {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }

    return state
  },

  doAddFiles: (files) => async ({ dispatch, store, getIpfs }) => {
    dispatch({ type: 'FILES_ADD_STARTED' })

    const ipfs = getIpfs()

    console.log(files)

    try {
      const { streams } = await filesToStreams(files)

      const addedFiles = await ipfs.add(streams, { pin: false })

      dispatch({ type: 'FILES_ADD_FINISHED', payload: { files: addedFiles } })
    } catch (e) {
      dispatch({ type: 'FILES_ADD_FAILED', payload: { error: e.message } })
    }
  }
}
