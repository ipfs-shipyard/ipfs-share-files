import { useCallback, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import viewFile from './utils/view'
import downloadFile from './utils/download'
import ENDPOINTS from '../../constants/endpoints'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Components
import FileIcon from './file-icon/FileIcon'

// Styles
import './File.css'
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'
import IconDownload from '../../media/icons/Download'
import IconView from '../../media/icons/View'
import GlyphAttention from '../../media/icons/GlyphAttention'
import { FileState } from '../../providers/FilesProvider'
import { doGetFile, doGetFileURL } from '../../util'
import { useHelia } from '../../hooks/useHelia'

export const File = ({file, isDownload}: {file: FileState, isDownload?: boolean}) => {
  const [progress, setProgress] = useState(100)
  const [copied, setCopied] = useState(false)
  const { unixfs } = useHelia()
  const { cid, name, size, error } = file

  const handleViewClick = useCallback(async () => {
    if (!cid) return
    const { url } = doGetFileURL(name, cid, { download: false })
    viewFile(url)
  }, [file])

  const handleDownloadClick = useCallback(async () => {
    console.log('handleDownloadClick cid, filename', cid, name)
    if (!unixfs || !cid) return

    const file = await doGetFile(unixfs, cid, name)
    console.log(file)
    const url = URL.createObjectURL(file)
    console.log(url, name)
    downloadFile(url, name)
    alert('FIX_ME')
  }, [file])

  const handleOnCopyClick = useCallback(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [copied])

  const renderWarningSign = useCallback(() => {
    // TODO make more robust
    const maxFileSize = 1024 * 1024 * 1024 // 1GB
    if (isDownload && file.size > maxFileSize) {
      return <GlyphAttention width={25} height={25} fill='#ffcc00' alt='Warning' />
    }
  }, [file, isDownload])

  const renderFileStatus = useCallback(() => {
    const _progress = isDownload ? progress : file.progress
    const fillColor = isDownload ? '#3e6175' : '#69c4cd'
    const glyphWidth = 25

    if (isDownload && _progress === 100) {
      return <div className='flex items-center'>
        { renderWarningSign() }
        <IconView
          className='pointer o-80 glow'
          width={glyphWidth + 5}
          fill={fillColor}
          style={{ marginRight: '-3px' }}
          onClick={handleViewClick}
          alt='View' />
        <IconDownload
          className='pointer o-80 glow'
          width={glyphWidth + 5}
          fill={fillColor}
          style={{ marginRight: '-3px' }}
          onClick={handleDownloadClick}
          alt='Download' />
      </div>
    } else if (error) {
      return <GlyphCancel width={glyphWidth} fill='#c7cad5' alt='Error' />
    } else if (progress === 100) {
      return <GlyphTick width={glyphWidth} fill={fillColor} alt='Tick' />
    } else {
      return (
        <div className='flex items-center'>
          { renderWarningSign() }
          <CircularProgressbar
            value={progress}
            strokeWidth={50}
            styles={{
              root: { width: 15, height: 15, marginLeft: 7, marginRight: 5 },
              path: { stroke: fillColor, strokeLinecap: 'butt' }
            }} />
        </div>
      )
    }
  }, [file, progress, isDownload])

  const renderCopyButton = useCallback(({ url, t }) => {
    if (isDownload) {
      return null
    }

    const copyBtnClass = classnames({
      'o-50 no-pointer-events': copied,
      'o-80 glow pointer': !copied
    }, ['pa2 w3 flex items-center justify-center br-pill bg-aqua f7 fw5'])

    return (
      <CopyToClipboard text={url} onCopy={handleOnCopyClick}>
        <div className={copyBtnClass}>
          {copied ? t('copyLink.copied') : t('copyLink.copy')}
        </div>
      </CopyToClipboard>
    )
  }, [isDownload, copied])

  const { t } = useTranslation()
  console.log('cid', cid)

  const fileNameClass = classnames({ charcoal: !error, gray: error }, ['FileLinkName ph2 f6 b truncate'])
  const fileSizeClass = classnames({ 'charcoal-muted': !error, gray: error }, ['f6'])

  const url = cid ? new URL(`/#${cid}?filename=${encodeURI(name)}`, window.location.href).toString() : undefined

  return (
    <div className='mv2 flex items-center justify-between'>
      <a
        title={t('box.viewOnGateway')}
        className='flex items-center link truncate FileLink'
        style={{ outline: 'none' }}
        href={url}
        target='_blank'
        rel='noopener noreferrer'>
        <div>
          {/* TODO figure out how type was passed thru */}
          <FileIcon className="flex-shrink-0" name={name} type={''} error={error} />
        </div>
        <span className={fileNameClass}>{name}</span>
        <span className={fileSizeClass}>{size && `(~${size})`}</span>
      </a>
      <div className='flex items-center'>
        <span className='ml-auto'>{ renderFileStatus() }</span>
        { renderCopyButton({ url, t }) }
      </div>
    </div>
  )
}
