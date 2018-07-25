import React from 'react'
import ipfsLogoText from '../../media/logos/ipfs-logo-text.svg'

const Header = () => (
  <div className='flex items-center pa4' style={{height: '150px'}}>
    <a href='/'>
      <img src={ipfsLogoText} style={{height: 65}} alt='IPFS' />
    </a>
    <div className='h3 ba mh4 teal' />
    <div className='f3 white'>Share by IPFS</div>
  </div>
)

export default Header
