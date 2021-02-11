import { getIpfs, providers } from 'ipfs-provider'
import Libp2p from 'libp2p'
import { FaultTolerance } from 'libp2p/src/transport-manager'
import ENDPOINTS from '../constants/endpoints'

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
            config: {
              Addresses: {
                Swarm: [
                  // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                  // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                  // '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
                  '/dns4/invalid-wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
                ]
              }
            },
            libp2p: ({ libp2pOptions }) => {
              libp2pOptions.transportManager = {
                // TODO: below seems ignored
                // https://github.com/libp2p/js-libp2p/blob/0a6bc0d1013dfd80ab600e8f74c1544b433ece29/doc/CONFIGURATION.md#configuring-transport-manager
                faultTolerance: FaultTolerance.NO_FATAL
              }
              return new Libp2p(libp2pOptions)
            }
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
