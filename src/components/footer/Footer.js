import React from 'react'
import plLogoText from '../../media/logos/protocol-labs-text.svg'

const Footer = () => (
  <div className='flex items-center justify-between pa4' style={{height: '100px'}}>
    <div className='f7 white'>&copy; Protocol Labs | Except as noted, content licensed CC-BY 3.0</div>
    <img src={plLogoText} height='50px' alt='Protocol Labs' />
  </div>
)

export default Footer
