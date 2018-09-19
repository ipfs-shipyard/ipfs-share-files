import React from 'react'
import { translate } from 'react-i18next'

// Static
import uploadImg from '../../media/images/upload.svg'

const Info = ({ t, imgHeigth = 110 }) => (
  <div className='pa4 pr5-l w-100 w-two-thirds-l mw7 self-start order-1-l'>
    <div className='mb4 f2 b white'>{t('info.title')}</div>
    <div className='mb5 f5 gray lh-copy'>{t('info.description')}</div>

    <div className='flex'>
      <div className='pa3 tc'>
        <img src={uploadImg} height={imgHeigth} alt='Upload' />
        <div className='mv2 f6 b white'>{t('info.label')}</div>
        <div className='f6 gray lh-copy'>{t('info.copy')}</div>
      </div>

      <div className='pa3 tc'>
        <img src={uploadImg} height={imgHeigth} alt='Upload' />
        <div className='mv2 f6 b white'>{t('info.label')}</div>
        <div className='f6 gray lh-copy'>{t('info.copy')}</div>
      </div>

      <div className='pa3 tc'>
        <img src={uploadImg} height={imgHeigth} alt='Upload' />
        <div className='mv2 f6 b white'>{t('info.label')}</div>
        <div className='f6 gray lh-copy'>{t('info.copy')}</div>
      </div>
    </div>
  </div>
)

export default translate()(Info)
