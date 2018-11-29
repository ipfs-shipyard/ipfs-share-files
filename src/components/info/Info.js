import React from 'react'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'

// Static
import DownloadIcon from '../../media/icons/StrokeDownload'
import ShareIcon from '../../media/icons/StrokeShare'
import CubeIcon from '../../media/icons/StrokeCube'

const Info = ({ t, imgHeight = 70, isDownload, ipfsProvider }) => {
  // Classes and styles
  const iconContainerClass = 'mr3 fill-aqua'
  const labelClass = 'mb3 white montserrat'
  const numberClass = 'mr2 aqua'
  const descriptionClass = 'f6 gray lh-copy'
  const anchorClass = 'link aqua'
  const anchorStyle = { outline: 'none' }
  // Links
  const ipfsLink = <a className={anchorClass} style={anchorStyle} href='https://ipfs.io/#how' target='_blank' rel='noopener noreferrer'>{t('info.learnMore')}</a>
  const cidLink = <a className={anchorClass} style={anchorStyle} href='https://docs.ipfs.io/guides/concepts/cid/' target='_blank' rel='noopener noreferrer'>{t('info.learnMore')}</a>

  const isUsingDaemon = ipfsProvider === 'window.ipfs' || ipfsProvider === 'js-ipfs-api'

  // Info for the Download page
  if (isDownload) {
    return (
      <div className='pa4 pr5-l w-100 w-two-thirds-l mw7-l self-start order-1-l'>
        <div className='mb5 f2 white montserrat'>{t('info.download.title')}</div>

        <div className='flex flex-column'>
          <div className='pa3 flex'>
            <div className={iconContainerClass}>
              <DownloadIcon height={imgHeight} style={{ marginTop: '-11px' }} alt='Download' />
            </div>
            <div>
              <div className={labelClass}>
                <span className={numberClass}>1.</span>
                {t('info.download.labelGet')}
              </div>
              <div className={descriptionClass}>
                {t('info.download.copyGet')} {ipfsLink}
              </div>
            </div>
          </div>

          <div className='pa3 flex'>
            <div className={iconContainerClass}>
              <CubeIcon height={imgHeight} style={{ marginTop: '-3px' }} alt='Cube' />
            </div>
            <div>
              <div className={labelClass}>
                <span className={numberClass}>2.</span>
                { isUsingDaemon ? t('info.download.labelKeepDaemon') : t('info.download.labelKeepPage') }
              </div>
              <div className={descriptionClass}>
                {isUsingDaemon ? t('info.download.copyKeepDaemon') : t('info.download.copyKeepPage')}
              </div>
            </div>
          </div>

          <div className='pa3 mv2 flex'>
            <div className={iconContainerClass}>
              <ShareIcon height={imgHeight} style={{ marginTop: '-13px' }} alt='Share' />
            </div>
            <div>
              <div className={labelClass}>
                <span className={numberClass}>3.</span>
                {t('info.download.labelSend')}
              </div>
              <div className={descriptionClass}>
                {t('info.download.copySend')} {cidLink}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Info for the Add page
  return (
    <div className='pa4 pr5-l w-100 w-two-thirds-l mw7-l self-start order-1-l'>
      <div className='mb5 f2 white montserrat'>{t('info.add.title')}</div>

      <div className='flex flex-column'>
        <div className='pa3 flex'>
          <div className={iconContainerClass}>
            <DownloadIcon height={imgHeight} style={{ marginTop: '-11px' }} alt='Download' />
          </div>
          <div>
            <div className={labelClass}>
              <span className={numberClass}>1.</span>
              {t('info.add.labelAdd')}
            </div>
            <div className={descriptionClass}>
              {t('info.add.copyAdd')} {ipfsLink}
            </div>
          </div>
        </div>

        <div className='pa3 mv2 flex'>
          <div className={iconContainerClass}>
            <ShareIcon height={imgHeight} style={{ marginTop: '-13px' }} alt='Share' />
          </div>
          <div>
            <div className={labelClass}>
              <span className={numberClass}>2.</span>
              {t('info.add.labelSend')}
            </div>
            <div className={descriptionClass}>
              {t('info.add.copySend')} {cidLink}
            </div>
          </div>
        </div>

        <div className='pa3 flex'>
          <div className={iconContainerClass}>
            <CubeIcon height={imgHeight} style={{ marginTop: '-3px' }} alt='Cube' />
          </div>
          <div>
            <div className={labelClass}>
              <span className={numberClass}>3.</span>
              {isUsingDaemon ? t('info.add.labelKeepDaemon') : t('info.add.labelKeepPage')}
            </div>
            <div className={descriptionClass}>{t('info.add.copyKeep')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TranslatedInfo = translate()(Info)

export default connect(
  'selectIpfsProvider',
  TranslatedInfo
)
