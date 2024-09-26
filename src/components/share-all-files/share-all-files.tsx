import classnames from 'classnames'
import { type CID } from 'multiformats/cid'
import { QRCodeSVG } from 'qrcode.react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { useFiles } from '../../hooks/useFiles'
import { useHelia } from '../../hooks/useHelia'
import { getShareLink } from '../file/utils/get-share-link'

/**
 * This component renders a QR code and a share link that reprents either:
 *
 * 1. The single file that is listed
 * 2. A root folder of an MFS representation of all files listed
 */
export const ShareAllFiles = ({ withLabel }: { withLabel?: boolean }): React.ReactNode => {
  const { files } = useFiles()
  const { mfs, helia } = useHelia()
  const [shareAllLink, setShareAllLink] = useState<string | null>()
  const [copied, setCopied] = useState(false)
  const [isShareDisabled, setShareDisabled] = useState(true)
  const [folderCid, setFolderCid] = useState<CID | null>(null)
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

  const copyBtnClass = classnames({
    'o-50 no-pointer-events': copied,
    'o-80 glow pointer': !copied,
    'o-50 no-pointer-events thing': isShareDisabled
  }, ['pa2 w3 flex items-center justify-center br-pill bg-navy f7 white'])

  useEffect(() => {
    if (mfs == null || helia == null) {
      return
    }
    const fetchShareLink = async (): Promise<void> => {
      try {
        // TODO: Share all link should be for a single file if there is only one file
        setShareAllLink(null)
        setFolderCid(null)
        const { cid } = await mfs.stat('/')
        setFolderCid(cid)

        const link = getShareLink(cid)
        setShareAllLink(link)
      } catch (e: any) {
        console.error(e)
        setShareAllLink(null)
      }
    }
    // if no files, or not all files are published, we can't create a share-all-files link
    if (shouldGenerateLink) {
      void fetchShareLink()
    } else {
      setShareAllLink(null)
    }
    return () => {
      // empty out share link if we're unmounting
      setShareDisabled(true)
      setShareAllLink(null)
    }
  }, [mfs, shouldGenerateLink])

  useEffect(() => {
    if (helia == null || folderCid == null) {
      return
    }
    // publish the folder CID
    void helia.routing.provide(folderCid, {
      onProgress: (evt) => {
        console.info(`Publish progress "${evt.type}" detail:`, evt.detail)
      }
    }).catch((err: Error) => {
      console.error('Could not provide the folder CID: ', err)
      // throw err
    }).then(() => {
      // share button can be enabled now
      console.info('Folder CID published')
      setShareDisabled(false)
    })
  }, [helia, folderCid])

  if (mfs == null || helia == null) {
    // we can't create a share-all-files link without helia, and mfs
    return null
  }

  if (!shouldGenerateLink) {
    return null
  }
  if (shareAllLink == null || !allFilesArePublished) {
    return 'Preparing link...'
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
            { copied ? t('copyLink.copied') : t('copyLink.copy') }
          </div>
        </CopyToClipboard>
      </div>
      <div className="overflow-hidden">
        <div className="flex flex-column items-center mb3 appear-from-below">
          <span className="f7 charcoal-muted lh-copy pb2">{t('copyLink.qrLabel')}</span>
          <QRCodeSVG
            value={shareAllLink}
            bgColor={'#ffffff'}
            fgColor={'#022E44'}
            level={'M'}
            // renderAs={'svg'}
            imageSettings={{
              src: 'favicon-32x32.png',
              x: 0,
              y: 0,
              height: 32,
              width: 32,
              excavate: true
            }}
          />
        </div>
      </div>
    </div>
  )
}
