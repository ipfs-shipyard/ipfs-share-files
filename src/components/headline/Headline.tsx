import React from 'react'
import { useTranslation } from 'react-i18next'

export interface HeadlineProps {
  imgHeight?: number
  isDownload: boolean
}

const Headline: React.FC<HeadlineProps> = ({ imgHeight = 70, isDownload }) => {
  const { t } = useTranslation('translation')
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

export default Headline
