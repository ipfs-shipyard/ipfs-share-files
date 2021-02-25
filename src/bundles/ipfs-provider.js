import { getIpfs, providers } from 'ipfs-provider'
import ENDPOINTS from '../constants/endpoints'
import { libp2pBundle } from '../lib/libp2p'

const initialState = {
  apiAddress: ENDPOINTS.apiMultiAddr,
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

const extra = {
  getIpfs () {
    return ipfs
  }
}

const selectors = {
  selectIpfsReady: state => state.ipfs.ready,
  selectIpfsProvider: state => state.ipfs.provider,
  selectIpfsApiAddress: state => state.ipfs.apiAddress,
  selectIpfsInitFailed: state => state.ipfs.failed
}

const actions = {
  doInitIpfs: () => async ({ getState, dispatch }) => {
    dispatch({ type: 'INIT_IPFS' })

    const result = await getIpfs({
      providers: [
        providers.jsIpfs({
          loadJsIpfsModule: () => require('ipfs-core'),
          options: {
            libp2p: libp2pBundle
          }
        })
      ]
    })

    if (!result) {
      dispatch({ type: 'IPFS_ERRORED' })
      throw Error('Could not connect to JS-IPFS')
    }

    ipfs = result.ipfs

    dispatch({ type: 'IPFS_STARTED' })

    return result
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
