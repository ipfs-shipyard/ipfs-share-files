import { createSelector } from 'redux-bundler'
import shortid from 'shortid'
import toUri from 'multiaddr-to-uri'
import { filesToStreams, makeHashFromFiles } from '../lib/files'
import ENDPOINTS from '../constants/endpoints'
import PAGES from '../constants/pages'

const initialState = {
  files: {},
  limits: {
    maxSize: 1073741824, // 1GB
    hasExceeded: false,
    hasDirs: false
  },
  shareLink: {
    outdated: false,
    link: null,
    hash: null
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
            hash: action.payload.hash,
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

      case 'FILES_MAX_SIZE_EXCEEDED':
        return {
          ...state,
          limits: {
            ...state.limits,
            hasExceeded: true
          }
        }

      case 'FILES_DIR_FOUND':
        return {
          ...state,
          limits: {
            ...state.limits,
            hasDirs: true
          }
        }

      case 'FILES_DOWNLOAD_STARTED':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              progress: 0,
              pending: true
            }
          }
        }

      case 'FILES_DOWNLOAD_PROGRESS':
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

      case 'FILES_DOWNLOAD_FINISHED':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              progress: 100,
              pending: false
            }
          },
          error: null
        }

      case 'FILES_DOWNLOAD_FAILED':
        return {
          ...state,
          files: {
            ...state.files,
            [action.payload.id]: {
              ...state.files[action.payload.id],
              progress: 100,
              pending: false
            }
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

  selectMaxFileSize: state => state.files.limits.maxSize,

  selectHasExceededMaxSize: state => state.files.limits.hasExceeded,

  selectHasDirs: state => state.files.limits.hasDirs,

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

  selectShareHash: state => state.files.shareLink.hash,

  selectIsShareLinkOutdated: state => state.files.shareLink.outdated,

  reactGetShareLink: createSelector(
    'selectIsShareLinkOutdated',
    'selectCurrentPage',
    'selectExistFiles',
    'selectExistFilesPending',
    (isShareLinkOutdated, currentPage, existFiles, existFilesPending) => {
      if (currentPage === PAGES.add && isShareLinkOutdated && existFiles && !existFilesPending) {
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
          id: fileId,
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
        const addedFile = await ipfs.files.add(stream, { pin: false, progress: updateProgress })
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

    const shareLink = `${ENDPOINTS.share}/${multihash}`

    if (storeShareLink !== shareLink) {
      dispatch({ type: 'FILES_SHARE_LINK', payload: { link: shareLink, hash: multihash } })
    }
  },

  doFetchFileTree: (hash) => async ({ dispatch, store, getIpfs }) => {
    let ipfsFiles
    let files = {}

    dispatch({ type: 'FILES_SHARE_LINK', payload: { hash: hash } })
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

      const maxSize = store.selectMaxFileSize()

      for (const file of ipfsFiles) {
        const fileId = shortid.generate()
        const fileName = file.name || file.Name
        const fileSize = file.size || file.Size
        const fileType = file.type || file.Type
        const fileHash = file.hash || file.Hash

        files[fileId] = {
          id: fileId,
          name: fileName,
          size: fileSize,
          type: fileType,
          hash: fileHash,
          progress: 100,
          pending: false
        }

        if (fileSize > maxSize) {
          dispatch({ type: 'FILES_MAX_SIZE_EXCEEDED' })
        }

        if (fileType === 'dir') {
          dispatch({ type: 'FILES_DIR_FOUND' })
        }
      }

      dispatch({ type: 'FILES_FETCH_FINISHED', payload: { files: files } })
    } catch (err) {
      dispatch({ type: 'FILES_FETCH_FAILED', payload: { error: err.message } })
    }
  },

  doGetFromIPFS: (id, hash) => async ({ dispatch, getIpfs }) => {
    return new Promise((resolve, reject) => {
      const ipfs = getIpfs()
      dispatch({ type: 'FILES_DOWNLOAD_STARTED', payload: { id: id } })

      try {
        const stream = ipfs.files.getReadableStream(hash)

        stream.on('data', (file) => {
          let chunks = []
          let bytesLoaded = 0

          file.content
            .on('data', (chunk) => {
              bytesLoaded += chunk.byteLength
              const progress = Math.round((bytesLoaded / file.size) * 100)

              dispatch({ type: 'FILES_DOWNLOAD_PROGRESS', payload: { id: id, progress: progress } })
              chunks.push(chunk)
            })
            .on('end', () => {
              // Get the total length of all arrays
              let length = 0
              chunks.forEach(arr => {
                length += arr.length
              })

              // Create a new array with total length and merge all source arrays
              let mergedArray = new Uint8Array(length)
              let offset = 0
              chunks.forEach(item => {
                mergedArray.set(item, offset)
                offset += item.length
              })

              dispatch({ type: 'FILES_DOWNLOAD_FINISHED', payload: { id: id } })
              resolve(mergedArray)
            })

          file.content.resume()
        })
      } catch (err) {
        dispatch({ type: 'FILES_DOWNLOAD_FAILED', payload: { id: id } })
      }
    })
  },

  doGetArchiveURL: (hash) => async ({ dispatch, store, getIpfs }) => {
    const ipfs = getIpfs()
    const apiAddress = store.selectIpfsApiAddress()
    dispatch({ type: 'FILES_ARCHIVE_FILES' })

    // Try to use the HTTP API of the local daemon
    const url = apiAddress !== null
      ? toUri(apiAddress).replace('tcp://', 'http://').concat('/api')
      : ENDPOINTS.api

    // If no hash was passed it is to download everything
    if (!hash) {
      const files = Object.values(store.selectFiles())
      hash = await makeHashFromFiles(files, ipfs)
    }

    return {
      url: `${url}/v0/get?arg=${hash}&archive=true&compress=true`,
      filename: `shared-via-ipfs_${hash.slice(-7)}.tar.gz`
    }
  },

  doResetFiles: () => ({ dispatch }) => dispatch({ type: 'FILES_RESET' })
}
