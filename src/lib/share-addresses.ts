import {
  WebRTC,
  WebRTCDirect,
  WebSocketsSecure,
  WebTransport,
  Circuit
} from '@multiformats/multiaddr-matcher'
import type { Multiaddr } from '@multiformats/multiaddr'

/**
 * Returns all browser-dialable WebRTC addresses
 */
export const getWebRTCAddrs = (addrs?: Multiaddr[]): Multiaddr[] => {
  return (
    addrs?.filter(
      (addr: Multiaddr) =>
        WebRTC.exactMatch(addr) &&
        (WebRTCDirect.matches(addr) ||
          WebSocketsSecure.matches(addr) ||
          WebTransport.matches(addr))
    ) ?? []
  )
}

/**
 * Returns a subset of addresses optimized for QR codes.
 * Prioritizes shorter direct addresses over longer relayed ones.
 * Limits both character count and address count to keep QR codes scannable.
 */
export const getAddrsForQR = (addrs?: Multiaddr[], maxLength = 500, maxAddrs = 5): Multiaddr[] => {
  if (addrs == null || addrs.length === 0) return []

  const webrtcAddrs = getWebRTCAddrs(addrs)

  // separate direct vs relayed addresses
  const direct: Multiaddr[] = []
  const relayed: Multiaddr[] = []

  for (const addr of webrtcAddrs) {
    if (Circuit.matches(addr)) {
      relayed.push(addr)
    } else {
      direct.push(addr)
    }
  }

  // sort each group by length (shorter first)
  direct.sort((a, b) => a.toString().length - b.toString().length)
  relayed.sort((a, b) => a.toString().length - b.toString().length)

  // prioritize direct addresses, then relayed
  const prioritized = [...direct, ...relayed]

  // select addresses until we hit character or count limit
  const selected: Multiaddr[] = []
  let totalLength = 0

  for (const addr of prioritized) {
    if (selected.length >= maxAddrs) {
      break
    }
    const addrLen = addr.toString().length
    if (totalLength + addrLen > maxLength) {
      break
    }
    selected.push(addr)
    totalLength += addrLen + 1 // +1 for comma separator
  }

  return selected
}
