import React from 'react'
import { useTranslation } from 'react-i18next'
import IpfsLogoText from '../../media/logos/ipfs-text.svg'
import NodeInfo from '../node-info/node-info'

const Header = (): React.JSX.Element => {
  const { t } = useTranslation('translation')
  return (
    <div className='flex flex-column flex-row-l items-start'>
      <div className='flex items-center pa4' style={{ height: '150px' }}>
        <a href='/'>
        <IpfsLogoText style={{ height: 65 }} alt='IPFS' />
        </a>
        <div className='h3 ba mh2 aqua' />
        <div className='ml2 pb2 f2 fw1 aqua montserrat'>{t('header')}</div>
      </div>
      <div className='ml-auto mt2-l mb0-l pa3 pb0 w-100 order-2-l pl3 pl4-ns mw7-l' style={{ marginLeft: 'auto' }}>
        <NodeInfo />
      </div>
    </div>
  )
}

export default Header
