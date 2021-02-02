import React from 'react'
import { withTranslation } from 'react-i18next'
import ipfsLogoText from '../../media/logos/ipfs-text.svg'

const Header = ({ t }) => (
  <div className='flex items-center pa4' style={{ height: '150px' }}>
    <a href='/'>
      <img src={ipfsLogoText} style={{ height: 65 }} alt='IPFS' />
    </a>
    <div className='h3 ba mh2 teal' />
    <div className='ml2 pb2 f2 fw1 white montserrat'>{t('header')}</div>
  </div>
)

export default withTranslation('translation')(Header)
