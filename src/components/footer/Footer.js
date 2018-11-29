import React from 'react'
import { translate, Trans } from 'react-i18next'
import plLogoText from '../../media/logos/protocol-labs-text.svg'

const Footer = () => {
  const anchorClass = 'link aqua'
  const anchorStyle = { outline: 'none' }

  return (
    <div className='flex items-center justify-between pa4' style={{height: '100px'}}>
      <div className='f7 white'>
        <Trans i18nKey='footer'>
          © Protocol Labs | Except as
          <a className={anchorClass} style={anchorStyle} href='https://protocol.ai/legal/' target='_blank' rel='noopener noreferrer'>noted</a>, content licensed
          <a className={anchorClass} style={anchorStyle} href='https://creativecommons.org/licenses/by/3.0/' target='_blank' rel='noopener noreferrer'>CC-BY 3.0</a>
        </Trans>
      </div>
      <a href='https://protocol.ai' target='_blank' rel='noopener noreferrer'>
        <img src={plLogoText} height='50px' alt='Protocol Labs' />
      </a>
    </div>
  )
}

export default translate()(Footer)
