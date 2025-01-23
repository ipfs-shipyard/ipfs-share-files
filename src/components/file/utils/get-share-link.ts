import { type CID } from 'multiformats/cid'
import type { Multiaddr } from '@multiformats/multiaddr'

export function getShareLink ({ cid, name, webrtcMaddrs }: { cid: string | CID, name?: string, webrtcMaddrs?: Multiaddr[] }): string {
  const url = new URL(`/#/${cid}?`, window.location.href)

  if (name !== undefined) {
    url.hash += `filename=${encodeURIComponent(name)}`
  }

  if (webrtcMaddrs !== undefined) {
    const encodedMaddrs = webrtcMaddrs.map(addr => addr.toString()).join(',')
    url.hash += `&maddrs=${encodeURIComponent(encodedMaddrs)}`
  }

  return url.toString()
}
