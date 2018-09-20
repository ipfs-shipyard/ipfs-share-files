import React from 'react'
import { translate } from 'react-i18next'
import plLogoText from '../../media/logos/protocol-labs-text.svg'

const Footer = ({ t }) => (
  <div className='flex items-center justify-between pa4' style={{height: '100px'}}>
    <div className='f7 white'>&copy; {t('footer')}</div>
    <a href='https://protocol.ai' target='_blank' rel='noopener noreferrer'>
      <img src={plLogoText} height='50px' alt='Protocol Labs' />
    </a>
  </div>
)

export default translate()(Footer)
