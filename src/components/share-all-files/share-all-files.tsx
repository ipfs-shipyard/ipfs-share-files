import classnames from 'classnames'
import { QRCodeSVG } from 'qrcode.react'
import React, { useCallback, useMemo, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { useFiles } from '../../hooks/use-files.js'
import { useHelia } from '../../hooks/use-helia.js'
import { getAddrsForQR } from '../../lib/share-addresses.js'
import { getShareLink } from '../file/utils/get-share-link.js'

/**
 * This component renders a QR code and a share link that reprents either:
 *
 * 1. The single file that is listed
 * 2. A root folder of an MFS representation of all files listed
 */
export const ShareAllFiles = ({ withLabel }: { withLabel?: boolean }): React.ReactNode => {
  const { files, shareLink, rootPublished } = useFiles()
  const { link: shareAllLink, cid: shareCid } = shareLink
  const { mfs, helia, nodeInfo } = useHelia()
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()
  const handleOnCopyClick = useCallback(() => {
    setCopied(true)
    setTimeout(() => { setCopied(false) }, 2500)
  }, [])

  /**
   * Whether files have been added and we should be thinking about generating a share-all-link
   */
  const shouldGenerateLink = useMemo(() => Object.keys(files).length > 0, [files])
  const allFilesArePublished = useMemo(() => Object.values(files).every((file) => file.published), [files])

  // generate a shorter link for QR codes using optimized address selection
  const qrLink = useMemo(() => {
    if (shareCid == null) return null
    return getShareLink({ cid: shareCid, webrtcMaddrs: getAddrsForQR(nodeInfo?.multiaddrs) })
  }, [shareCid, nodeInfo?.multiaddrs])

  const disabled = !allFilesArePublished || !rootPublished

  const copyBtnClass = classnames({
    'o-50 no-pointer-events': copied,
    'o-80 glow pointer': !copied,
    'o-50 no-pointer-events bg-gray navy w4': disabled
  }, ['pa2 w3 flex items-center justify-center br-pill bg-navy f7 white'])

  if (mfs == null || helia == null) {
    // we can't create a share-all-files link without helia, and mfs
    return null
  }

  if (!shouldGenerateLink) {
    return null
  }
  if (shareAllLink == null) {
    return 'Preparing link...'
  }

  let copyBtnTxt = t('copyLink.copy')
  if (disabled) {
    copyBtnTxt = t('copyLink.publishing')
  } else if (copied) {
    copyBtnTxt = t('copyLink.copied')
  }

  return (
    <div>
      { withLabel === true ? <div className='f5 montserrat fw4 charcoal mt4 mb1'>{t('copyLink.labelAll')}</div> : null }
      <div className='f7 charcoal-muted lh-copy'>
        {t('copyLink.footNote')}
      </div>
      <div className='pa1 mt2 mb3 w-100 flex items-center justify-between br-pill bg-light-gray'>
        <div className='ph2 w-80 f7 navy truncate'>
          { shareAllLink }
        </div>
        <CopyToClipboard text={shareAllLink} onCopy={handleOnCopyClick}>
          <div className={copyBtnClass}>
            { copyBtnTxt }
          </div>
        </CopyToClipboard>
      </div>
      <div className="overflow-hidden">
        <div className="flex flex-column items-center mb3 appear-from-below">
          <span className="f7 charcoal-muted lh-copy pb2">{t('copyLink.qrLabel')}</span>
          {qrLink != null && (
            <span style={disabled ? { filter: 'blur(2px)' } : {}}>
              <QRCodeSVG
                value={qrLink}
                bgColor={'#ffffff'}
                fgColor={'#022E44'}
                level={'M'}
                imageSettings={{
                  src: 'favicon-32x32.png',
                  x: 50,
                  y: 50,
                  height: 32,
                  width: 32,
                  excavate: true
                }}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
