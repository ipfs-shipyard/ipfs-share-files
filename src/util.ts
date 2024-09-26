import { type UnixFS } from '@helia/unixfs'
import { type CID } from 'multiformats/cid'
import { asyncItToFile } from './components/file/utils/async-it-to-file'

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

export async function doGetFile (unixfs: UnixFS, cid: CID, filename: string): Promise<File> {
  const file = asyncItToFile(unixfs.cat(cid), filename)

  return file
}
