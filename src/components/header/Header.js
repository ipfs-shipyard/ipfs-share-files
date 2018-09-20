import React from 'react'
import { translate } from 'react-i18next'
import ipfsLogoText from '../../media/logos/ipfs-text.svg'

const Header = ({ t }) => (
  <div className='flex items-center pa4' style={{height: '150px'}}>
    <a href='/'>
      <img src={ipfsLogoText} style={{height: 65}} alt='IPFS' />
    </a>
    <div className='h3 ba mh4 teal' />
    <div className='f3 white montserrat'>{t('header')}</div>
  </div>
)

export default translate()(Header)
