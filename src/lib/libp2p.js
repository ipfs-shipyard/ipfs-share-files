import Libp2p from 'libp2p'
import WS from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import MPLEX from 'libp2p-mplex'
import Bootstrap from 'libp2p-bootstrap'
import { NOISE } from 'libp2p-noise'
import GossipSub from 'libp2p-gossipsub'
import { FaultTolerance } from 'libp2p/src/transport-manager'

export const libp2pBundle = (opts) => {
  const peerId = opts.peerId
  const bootstrapList = opts.config.Bootstrap
  return new Libp2p({
    peerId,
    addresses: {
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ]
    },
    dialer: {
      maxParallelDials: 150, // 150 total parallel multiaddr dials
      maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
      dialTimeout: 10e3 // 10 second dial timeout per peer dial
    },
    modules: {
      transport: [WS, WebRTCStar],
      streamMuxer: [MPLEX],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap],
      pubsub: GossipSub
    },
    transportManager: {
      // https://github.com/libp2p/js-libp2p/blob/0a6bc0d1013dfd80ab600e8f74c1544b433ece29/doc/CONFIGURATION.md#configuring-transport-manager
      // We don't want js-ipfs boot to fail when all webrtc signaling servers are down
      faultTolerance: FaultTolerance.NO_FATAL
    },
    config: {
      peerDiscovery: {
        autoDial: true,
        // [Bootstrap.tag] = 'bootstrap'
        bootstrap: {
          enabled: true,
          list: bootstrapList
        },
        // [WebRTCStar.discovery.tag]
        webRTCStar: {
          enabled: true
        }
      },
      dht: {
        enabled: false
      },
      pubsub: {
        enabled: true,
        emitSelf: true
      },
      nat: {
        enabled: false
      }
    },
    metrics: {
      enabled: false
    },
    peerStore: {
      persistence: true,
      threshold: 1
    }
  })
}
