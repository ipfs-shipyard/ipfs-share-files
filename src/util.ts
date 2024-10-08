import { type CID } from 'multiformats/cid'

export interface FileURL {
  url: string
  filename: string
}

export function doGetFileURL (filename: string, cid: CID, opts = { download: true }): FileURL {
  return {
    url: `#/${cid}?${opts.download ? 'download=true&' : ''}filename=${encodeURIComponent(filename)}`,
    filename
  }
}
