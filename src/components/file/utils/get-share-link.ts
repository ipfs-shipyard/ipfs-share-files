import { type CID } from 'multiformats/cid'
export function getShareLink (cid: string | CID, name?: string): string {
  if (name === undefined) {
    // return new URL(`/#${cid}`, window.location.href).toString()
    // set name to a timestamp
    name = new Date().toISOString()
  }

  return new URL(`/#${cid}?filename=${encodeURI(name)}`, window.location.href).toString()
}
