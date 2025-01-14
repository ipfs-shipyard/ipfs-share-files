import { WebRTC } from '@multiformats/multiaddr-matcher'
import type { Multiaddr } from '@multiformats/multiaddr'

export const getWebRTCAddrs = (addrs?: Multiaddr[]): Multiaddr[] => {
  // TODO: Get only WebRTC addrs dialable from other browsers, e.g. WebRTC Direct, WebRTC Secure WebSockets, and WebRTC WebTransport (currently not included in Helia transports)
  return addrs?.filter((addr: Multiaddr) => WebRTC.exactMatch(addr)) ?? []
}
