import ENDPOINTS from '../constants/endpoints'
import { create } from 'ipfs-core'

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

    // const result = await getIpfs({
    //   providers: [
    //     providers.jsIpfs({
    //       loadJsIpfsModule: () => require('ipfs-core'),
    //       options: {
    //         // we use custom libp2p bundle for fine-grained control
    //         libp2p: libp2pBundle
    //       }
    //     })
    //   ]
    // })

    try {
      ipfs = await create()
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
