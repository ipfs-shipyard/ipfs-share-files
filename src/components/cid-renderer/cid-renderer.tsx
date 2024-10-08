import { type UnixFS } from '@helia/unixfs'
import React, { useEffect } from 'react'
import { type FileState } from '../../providers/files-provider'
import { asyncItToFile } from '../file/utils/async-it-to-file'

export interface CidRendererProps {
  // cid: string
  file: FileState
  unixfs: UnixFS | null
}

export const CidRenderer: React.FC<CidRendererProps> = ({ file, unixfs }: CidRendererProps) => {
  const [contentType, setContentType] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [blob, setBlob] = React.useState<Blob | null>(null)
  const [text, setText] = React.useState('')
  const cid = file.cid

  useEffect(() => {
    if (cid === null || unixfs == null || isLoading) {
      return
    }
    setIsLoading(true)
    const fetchContent = async (): Promise<void> => {
      const actualFile = await asyncItToFile(unixfs.cat(cid), file.name)

      setContentType(actualFile.type)
      setBlob(actualFile)
      if (actualFile.type.startsWith('text/')) {
        setText(await actualFile.text())
      }
      setIsLoading(false)
    }

    void fetchContent()
  }, [cid, file, unixfs])

  // console.log('cid: ', cid)
  if (cid == null) {
    return <span>Nothing to render yet. Enter a CID</span> // bafkreiezuss4xkt5gu256vjccx7vocoksxk77vwmdrpwoumfbbxcy2zowq
  }

  if (isLoading || unixfs == null) {
    return <span>Loading...</span>
  }

  if (contentType?.startsWith('video/') === true && blob != null) {
    return (
      <video controls autoPlay loop className="center" width="100%">
        <source src={URL.createObjectURL(blob)} type={contentType} />
        <track kind="captions" />
      </video>
    )
  }
  if (contentType?.startsWith('image/') === true && blob != null) {
    return <img src={URL.createObjectURL(blob)} alt={file.name} />
  }
  if (contentType?.startsWith('text/') === true && blob != null) {
    return <pre>{text}</pre>
  }
  return <span>Not a supported content-type of <pre>{contentType}</pre></span>
}

export default CidRenderer
