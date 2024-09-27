import React from 'react'
import { useTranslation } from 'react-i18next'
import IpfsLogoText from '../../media/logos/ipfs-text.svg'

const Header = (): React.JSX.Element => {
  const { t } = useTranslation('translation')
  return (
    <div className='flex items-center pa4' style={{ height: '150px' }}>
      <a href='/'>
      <IpfsLogoText style={{ height: 65 }} alt='IPFS' />
      </a>
      <div className='h3 ba mh2 aqua' />
      <div className='ml2 pb2 f2 fw1 aqua montserrat'>{t('header')}</div>
    </div>
  )
}

export default Header
