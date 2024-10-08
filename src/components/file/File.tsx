import classnames from 'classnames'
import GlyphAttention from 'ipfs-css/icons/glyph_attention.svg'
import GlyphCancel from 'ipfs-css/icons/glyph_cancel.svg'
import GlyphTick from 'ipfs-css/icons/glyph_tick.svg'
import React, { useCallback, useMemo, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { useHelia } from '../../hooks/useHelia'
import IconDownload from '../../media/icons/download.svg'
import IconView from '../../media/icons/view.svg'
import { type FileState } from '../../providers/FilesProvider'
import CidRenderer from '../cid-renderer/cid-renderer'
import Modal from '../modal/Modal'
import FileIcon from './file-icon/FileIcon'
import { downloadCidAsFile } from './utils/download'
import { getShareLink } from './utils/get-share-link'
import './File.css'
import 'react-circular-progressbar/dist/styles.css'

export const File = ({ file, isDownload }: { file: FileState, isDownload?: boolean }): React.JSX.Element => {
  const { t } = useTranslation()
  // TODO: implement progress
  const [progress] = useState(100)
  const [copied, setCopied] = useState(false)
  const { unixfs } = useHelia()

  const [showModalView, setShowModalView] = useState(false)

  const handleOpenModalView = useCallback(() => {
    setShowModalView(true)
  }, [])

  const handleCloseModalView = useCallback(() => {
    setShowModalView(false)
  }, [])
  const { cid, name, size, error } = file

  const handleViewClick = useCallback(async () => {
    if (file == null) return
    handleOpenModalView()
  }, [file])

  const handleDownloadClick = useCallback(async () => {
    if (unixfs == null || cid == null) return

    await downloadCidAsFile({ unixfs, cid, filename: name })
  }, [file, unixfs, cid])

  const handleOnCopyClick = useCallback(() => {
    setCopied(true)
    setTimeout(() => { setCopied(false) }, 1500)
  }, [copied])

  const renderWarningSign = useCallback(() => {
    // TODO make more robust
    const maxFileSize = 1024 * 1024 * 1024 // 1GB
    if (isDownload === true && file.size > maxFileSize) {
      return <GlyphAttention width={25} height={25} fill='#ffcc00' alt='Warning' />
    }
  }, [file, isDownload])

  const renderFileStatus = useCallback(() => {
    const _progress = isDownload === true ? progress : file.progress
    const fillColor = isDownload === true ? '#3e6175' : '#69c4cd'
    const glyphWidth = 25

    if (isDownload === true && _progress === 100) {
      return <div className='flex items-center'>
        { renderWarningSign() }
        {/* TODO: disable preview link for un-previewable files */}
        <IconView
          className='pointer o-80 glow'
          width={glyphWidth + 5}
          fill={fillColor}
          style={{ marginRight: '-3px' }}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleViewClick}
          alt='View' />
        <IconDownload
          className='pointer o-80 glow'
          width={glyphWidth + 5}
          fill={fillColor}
          style={{ marginRight: '-3px' }}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleDownloadClick}
          alt='Download' />
      </div>
    } else if (error != null) {
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
  const disabled = useMemo(() => !file.published, [file.published])
  const renderCopyButton = useCallback((url?: string) => {
    if (isDownload === true) {
      return null
    }
    if (url == null) {
      // TODO: Fix this.. this shouldn't be needed.
      return <div className='pa2 w3 flex items-center justify-center br-pill bg-aqua f7 fw5 o-50 no-pointer-events'>{t('copyLink.copy')}</div>
    }

    const copyBtnClass = classnames({
      'o-50 no-pointer-events': copied,
      'o-80 glow pointer': !copied,
      'o-50 no-pointer-events bg-gray': disabled
    }, ['pa2 w3 flex items-center justify-center br-pill bg-aqua f7 fw5'])

    return (
      <CopyToClipboard text={url} onCopy={handleOnCopyClick}>
        <div className={copyBtnClass}>
          {copied ? t('copyLink.copied') : t('copyLink.copy')}
        </div>
      </CopyToClipboard>
    )
  }, [isDownload, copied, disabled, t])

  const fileNameClass = classnames({ charcoal: error == null, gray: error }, ['FileLinkName ph2 f6 b truncate'])
  const fileSizeClass = classnames({ 'charcoal-muted': error == null, gray: error }, ['f6'])

  const url = cid != null ? getShareLink(cid, name) : undefined

  return (
    <div className='mv2 flex items-center justify-between'>
      <div
        title={t('box.viewOnGateway')}
        className='flex items-center truncate'
        style={{ outline: 'none' }}
        rel='noopener noreferrer'
        >
        <div>
          {/* TODO figure out how type was passed thru */}
          <FileIcon className="flex-shrink-0" name={name} error={error} />
        </div>
        <span className={fileNameClass}>{name}</span>
        <span className={fileSizeClass}>{size != null ? `(~${size})` : ''}</span>
      </div>
      <div className='flex items-center'>
        <span className='ml-auto'>{ renderFileStatus() }</span>
        { renderCopyButton(url) }
      </div>
      <Modal
        isOpen={showModalView}
        onClose={handleCloseModalView}
        onRequestClose={handleCloseModalView}
        title={file.name}
        contentLabel={cid?.toString()}
      >
        <CidRenderer file={file} unixfs={unixfs}/>
      </Modal>
    </div>

  )
}
