import React from 'react'
import { translate } from 'react-i18next'

// Static
import DownloadIcon from '../../media/icons/StrokeDownload'
import ShareIcon from '../../media/icons/StrokeShare'
import CubeIcon from '../../media/icons/StrokeCube'

const Info = ({ t, imgHeight = 70 }) => {
  const iconContainerClass = 'mr3 fill-aqua'
  const labelClass = 'mb3 white montserrat'
  const numberClass = 'mr2 aqua'
  const descriptionClass = 'f6 gray lh-copy'

  return (
    <div className='pa4 pr5-l w-100 w-two-thirds-l mw7-l self-start order-1-l'>
      <div className='mb5 f2 white montserrat'>{t('info.title')}</div>

      <div className='flex flex-column'>
        <div className='pa3 flex'>
          <div className={iconContainerClass}>
            <DownloadIcon height={imgHeight} style={{ marginTop: '-11px' }} alt='Download' />
          </div>
          <div clasName='flex'>
            <div className={labelClass}>
              <span className={numberClass}>1.</span>
              {t('info.labelAdd')}
            </div>
            <div className={descriptionClass}>{t('info.copyAdd')}</div>
          </div>
        </div>

        <div className='pa3 mv2 flex'>
          <div className={iconContainerClass}>
            <ShareIcon height={imgHeight} style={{ marginTop: '-13px' }} alt='Share' />
          </div>
          <div clasName='flex'>
            <div className={labelClass}>
              <span className={numberClass}>2.</span>
              {t('info.labelSend')}
            </div>
            <div className={descriptionClass}>{t('info.copySend')}</div>
          </div>
        </div>

        <div className='pa3 flex'>
          <div className={iconContainerClass}>
            <CubeIcon height={imgHeight} style={{ marginTop: '-3px' }} alt='Cube' />
          </div>
          <div clasName='flex'>
            <div className={labelClass}>
              <span className={numberClass}>3.</span>
              {t('info.labelKeep')}
            </div>
            <div className={descriptionClass}>{t('info.copyKeep')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default translate()(Info)
