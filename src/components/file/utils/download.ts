import JsZip from 'jszip'
import { asyncItToFile } from './async-it-to-file'
import type { FileState } from '../../../providers/files-provider'
import type { UnixFS } from '@helia/unixfs'
import type { CID } from 'multiformats/cid'
export const download = (url: string, fileName: string): void => {
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.click()
}

export interface DownloadCidAsFileOptions {
  unixfs: UnixFS
  cid: CID
  filename: string
}

export const downloadCidAsFile = async ({ unixfs, cid, filename }: DownloadCidAsFileOptions): Promise<void> => {
  const file = await asyncItToFile(unixfs.cat(cid), filename)
  const url = URL.createObjectURL(file)
  download(url, filename)
}

export interface DownloadAllFilesOptions {
  files: Record<string, FileState>
  unixfs: UnixFS
  /**
   * The CID for the group of files (e.g. a unixfs folder root CID)
   */
  cid?: CID
}

export const downloadAllFiles = async ({ files, unixfs, cid }: DownloadAllFilesOptions): Promise<void> => {
  const zip = new JsZip()
  const filePromises = Object.values(files).map(async (fileState) => {
    if (fileState.cid == null) {
      // this should never happen
      return
    }
    const file = await asyncItToFile(unixfs.cat(fileState.cid), fileState.name)
    zip.file(file.name, file)
  })
  await Promise.all(filePromises)
  await zip.generateAsync({ type: 'blob' }).then((content) => {
    download(URL.createObjectURL(content), `${cid ?? 'files'}.zip`)
  })
}
