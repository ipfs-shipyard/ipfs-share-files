import { CID } from 'multiformats/cid'
import { UnixFS } from '@helia/unixfs'
import { asyncItToFile } from './components/file/utils/async-it-to-file'

export function doGetFileURL (filename: string, cid: CID, opts = { download: true }) {
  return {
    url: `#/${cid}?${opts.download ? 'download=true&' : ''}filename=${encodeURIComponent(filename)}`,
    filename
  }
}

export function doGetFile (unixfs: UnixFS, cid: CID, filename: string) {
  // TODO fix this
  // @ts-expect-error types mismatch
  const file = asyncItToFile(unixfs.cat(cid), filename)

  return file
}
