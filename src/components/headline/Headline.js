import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'

const Headline = ({ t, imgHeight = 70, isDownload, ipfsProvider }) => {
  // Download page
  if (isDownload) {
    return (
      <div className='pv4'>
        <div className='mb3 f2 white montserrat'>{t('info.download.title')}</div>
        <div className='f4 fw1 white montserrat'>{t('info.download.subtitle')}</div>
      </div>
    )
  }

  // Add page
  return (
    <div className='pv4'>
      <div className='mb3 f2 white montserrat'>{t('info.add.title')}</div>
      <div className='f4 fw1 white montserrat'>{t('info.add.subtitle')}</div>
    </div>
  )
}

export const TranslatedHeadline = withTranslation('translation')(Headline)

export default connect(
  'selectIpfsProvider',
  TranslatedHeadline
)
