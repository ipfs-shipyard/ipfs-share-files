import React from 'react'
import plLogoText from '../../media/logos/protocol-labs-text.svg'

const Footer = () => (
  <div className='flex items-center justify-between pa4' style={{height: '100px'}}>
    <div className='f6 white'>&copy; Protocol Labs | Except as noted, content licensed CC-BY 3.0</div>
    <div className='f6 white'>
      <img src={plLogoText} style={{height: 50}} alt='Protocol Labs' />
    </div>
  </div>
)

export default Footer
