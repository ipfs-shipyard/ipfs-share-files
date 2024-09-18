import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { mfs } from '@helia/mfs'
import { devToolsMetrics } from '@libp2p/devtools-metrics'

const initialState = {
  failed: false,
  ready: false
}

const reducer = (state = initialState, action) => {
  if (action.type === 'IPFS_INIT') {
    return { ...state, ready: false, failed: false }
  }
  if (action.type === 'IPFS_ERRORED') {
    return { ...state, ready: false, failed: true }
  }
  if (action.type === 'IPFS_STARTED') {
    return { ...state, ready: true, failed: false }
  }

  return state
}

let ipfs = null
let fs = null

const extra = {
  getIpfs () {
    return ipfs
  },
  getFs () {
    if (fs == null) {
      fs = mfs(ipfs)
    }
    return fs
  },
  getUnixFs () {
    return unixfs(ipfs)
  }
}

const selectors = {
  selectIpfsReady: state => state.ipfs.ready,
  selectIpfsProvider: state => state.ipfs.provider,
  selectIpfsApiAddress: state => state.ipfs.apiAddress,
  selectIpfsInitFailed: state => state.ipfs.failed,
}

const actions = {
  doInitIpfs: () => async ({ getState, dispatch }) => {
    dispatch({ type: 'INIT_IPFS' })

    try {
      ipfs = await createHelia({
        libp2p: {
          metrics: devToolsMetrics()
        }
      })
    } catch (err) {
      dispatch({ type: 'IPFS_ERRORED' })
      throw Error('Could not connect to JS-IPFS')
    }

    dispatch({ type: 'IPFS_STARTED' })

    return { ipfs }
  }
}

const bundle = {
  name: 'ipfs',
  reducer,
  getExtraArgs: () => extra,
  ...selectors,
  ...actions
}

export default bundle
