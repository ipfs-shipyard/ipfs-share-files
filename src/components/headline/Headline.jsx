import { withTranslation } from 'react-i18next'

const Headline = ({ t, imgHeight = 70, isDownload }) => {
  // Download page
  if (isDownload) {
    return (
      <div className='pv4'>
        <div className='mb3 f2 white montserrat'>{t('info.download.title')}</div>
        <div className='mb4 f4 fw1 white montserrat'>{t('info.download.subtitle')}</div>
      </div>
    )
  }

  // Add page
  return (
    <div className='pv4'>
      <div className='mb3 f2 white montserrat'>{t('info.add.title')}</div>
      <div className='mb4 f4 fw1 white montserrat'>{t('info.add.subtitle')}</div>
    </div>
  )
}

export default withTranslation('translation')(Headline)
