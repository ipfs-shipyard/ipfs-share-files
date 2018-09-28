import React from 'react'
import { translate } from 'react-i18next'

// Static
import addImg from '../../media/images/add.svg'

const Info = ({ t, imgHeigth = 110 }) => {
  const labelClass = 'mv3 white montserrat'
  const copyClass = 'f6 gray lh-copy'
  const copyStyle = { flexBasis: '100%' }

  return (
    <div className='pa4 pr5-l w-100 w-two-thirds-l mw7 self-start order-1-l'>
      <div className='mb3 f2 white montserrat'>{t('info.title')}</div>
      <div className='mb5 f5 gray lh-copy'>{t('info.description')}</div>

      <div className='flex'>
        <div className='pa3 tc' style={copyStyle}>
          <img src={addImg} height={imgHeigth} alt='Add' />
          <div className={labelClass}>{t('info.labelAdding')}</div>
          <div className={copyClass}>{t('info.copyAdding')}</div>
        </div>

        <div className='pa3 tc' style={copyStyle}>
          <img src={addImg} height={imgHeigth} alt='Add' />
          <div className={labelClass}>{t('info.labelNodes')}</div>
          <div className={copyClass}>{t('info.copyNodes')}</div>
        </div>

        <div className='pa3 tc' style={copyStyle}>
          <img src={addImg} height={imgHeigth} alt='Add' />
          <div className={labelClass}>{t('info.labelGetting')}</div>
          <div className={copyClass}>{t('info.copyGetting')}</div>
        </div>
      </div>
    </div>
  )
}

export default translate()(Info)
