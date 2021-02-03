import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'

// Static
import DownloadIcon from '../../media/icons/StrokeDownload'
import ShareIcon from '../../media/icons/StrokeShare'
import CubeIcon from '../../media/icons/StrokeCube'

const Info = ({ t, imgHeight = 70, isDownload, ipfsProvider }) => {
  // Classes and styles
  const iconContainerClass = 'mr3 fill-aqua'
  const labelClass = 'f4 fw1 mb2 ml1 white montserrat'
  const descriptionClass = 'f6 ml1 gray-muted lh-copy'
  const anchorClass = 'no-underline underline-hover aqua'
  const anchorStyle = { outline: 'none' }
  // Links
  const ipfsLink = <a className={anchorClass} style={anchorStyle} href='https://ipfs.io/#how' target='_blank' rel='noopener noreferrer'>{t('info.learnMore')}</a>
  const cidLink = <a className={anchorClass} style={anchorStyle} href='https://docs.ipfs.io/guides/concepts/cid/' target='_blank' rel='noopener noreferrer'>{t('info.learnMore')}</a>

  const isUsingDaemon = ipfsProvider === 'js-ipfs-api'

  // Info for the Download page
  if (isDownload) {
    return (
      <div className='pa4 pl0 pr5-l w-100 w-two-thirds-l mw7-l self-start order-1-l'>

        <div className='flex flex-column'>
          <div className='pa3 flex'>
            <div className={iconContainerClass}>
              <DownloadIcon height={imgHeight} style={{ marginTop: '-11px' }} alt='Download' />
            </div>
            <div>
              <div className={labelClass}>
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
    <div className='pr5-l w-100 w-two-thirds-l mw7-l'>

      <div className='mv4 mv2-l flex flex-column'>
        <div className='flex items-center'>
          <div className={iconContainerClass}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M48.78 79.59V31H37.59v-8.59h20.82v57.18z"/><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /></svg>
          </div>
          <div>
            <div className={labelClass}>
              {t('info.add.labelAdd')}
            </div>
            <div className={descriptionClass}>
              {t('info.add.copyAdd')} {ipfsLink}
            </div>
          </div>
        </div>

        <div className='mv4 pv2 flex items-center'>
          <div className={iconContainerClass}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M68.64 34.43c0 5.8-4.41 12.26-10.45 18.79L43.32 69h27.94v8.65H30.58v-7L51.65 48c4.17-4.24 7-8.9 7-12.17 0-4.57-3.6-7.35-9.56-7.35-5 0-10.78 2.78-15.6 7.19l-3.89-7.44c6.21-5.07 13.48-8.17 20.83-8.17 10.78 0 18.21 5.63 18.21 14.37z"/></svg>          </div>
          <div>
            <div className={labelClass}>
              {isUsingDaemon ? t('info.add.labelKeepDaemon') : t('info.add.labelKeepPage')}
            </div>
            <div className={descriptionClass}>{t('info.add.copyKeep')}</div>
          </div>
        </div>

        <div className='flex items-center'>
          <div className={iconContainerClass}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M54.81 47.14c9.56.86 16.09 6.37 16.09 15.35 0 10.71-8.08 18.14-20.82 18.14a33.08 33.08 0 01-19.28-6.21l4-7.84a21.58 21.58 0 0014.62 6c7.6 0 12-3.92 12-9.8 0-6.21-4.49-9.39-12.09-9.39h-7.91v-5.68l14.86-16H33.41v-8.59h34.8v6.05L51.87 46.81z"/></svg>          </div>
          <div>
            <div className={labelClass}>
              {t('info.add.labelSend')}
            </div>
            <div className={descriptionClass}>
              {t('info.add.copySend')} {cidLink}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TranslatedInfo = withTranslation('translation')(Info)

export default connect(
  'selectIpfsProvider',
  TranslatedInfo
)
