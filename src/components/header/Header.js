import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import ipfsLogoText from '../../media/logos/ipfs-text.svg'
import { localesList } from '../../i18n'
import i18n from 'i18next'
import Dropdown from '../dropdown/Dropdown'

import LanguageIcon from '../../media/icons/Language'

const Header = ({ t }) => {
  const defaultLanguage = window.localStorage.getItem('i18nextLng')?.split('-')[0]
  const [selectedLanguage, setLanguage] = useState(defaultLanguage)

  const onLocaleChange = (locale) => {
    window.localStorage.setItem('i18nextLng', locale)
    setLanguage(locale)
    i18n.changeLanguage(locale)
  }

  return <div className="flex justify-between items-center pa4" style={{ height: '150px' }}>
    <div className='flex items-center' >
      <a href='/'>
        <img src={ipfsLogoText} style={{ height: 65 }} alt='IPFS' />
      </a>
      <div className='h3 ba mh2 aqua' />
      <div className='ml2 pb2 f2 fw1 aqua montserrat'>{t('header')}</div>
    </div>

    <Dropdown options={localesList} Icon={LanguageIcon} onChange={onLocaleChange} selectedOption={selectedLanguage}/>
  </div>
}

export default withTranslation('translation')(Header)
