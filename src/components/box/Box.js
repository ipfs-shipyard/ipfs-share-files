import React from 'react'

// Components
import File from '../file//File'
import CopyIcon from '../../media/icons/GlyphCopy.js'

// Static
import twitterLogo from '../../media/logos/twitter.svg'
import facebookLogo from '../../media/logos/facebook.svg'
import githubLogo from '../../media/logos/github.svg'

const FileTree = () => {
  return (
    <File
      hash='Qm3fsA'
      name='game-of-thrones.mkv'
      type='video'
      size='265318832' />
  )
}

const CopyLink = () => (
  <div className='mt4'>
    <div className='f6 charcoal'>Copy link:</div>
    <div className='flex mt3'>
      <input type='text' className='pa2 flex-auto ba b--moon-gray moon-gray f6' />
      <CopyIcon className='ml1 fill-aqua pointer' height='35px' alt='Copy' />
    </div>
  </div>
)

const SocialShare = () => {
  const logoHeight = 40

  return (
    <div className='mt4 mb6'>
      <div className='f6 charcoal'>Share on social media:</div>
      <div className='mt3'>
        <img src={twitterLogo} height={logoHeight} className='pointer o-50 glow' alt='Twitter' />
        <img src={facebookLogo} height={logoHeight} className='mh2 pointer o-50 glow' alt='Facebook' />
        <img src={githubLogo} height={logoHeight} className='pointer o-50 glow' alt='GitHub' />
      </div>
    </div>
  )
}

const Footnote = () => (
  <div className='f7 gray lh-copy'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
)

const Box = () => {
  return (
    <div className='pa4 ba br3 b--silver shadow-1 bg-white w-third'>
      <FileTree />
      <CopyLink />
      <SocialShare />
      <Footnote />
    </div>
  )
}

export default Box
