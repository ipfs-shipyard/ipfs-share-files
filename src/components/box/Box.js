import React from 'react'
import { connect } from 'redux-bundler-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Components
import FileAdd from '../file//file-add/FileAdd'
import FileTree from '../file//file-tree/FileTree'
import CopyIcon from '../../media/icons/GlyphCopy.js'

// Static
import twitterLogo from '../../media/logos/twitter.svg'
import facebookLogo from '../../media/logos/facebook.svg'
import githubLogo from '../../media/logos/github.svg'

const CopyLink = ({ shareLink }) => (
  <div className='mt4'>
    <div className='f6 charcoal'>Copy link:</div>
    <div className='flex mt3'>
      <div className='pa2 w-90 flex items-center ba b--moon-gray moon-gray f7 truncate'>
        { shareLink }
      </div>
      <CopyToClipboard text={shareLink}>
        <CopyIcon className='ml1 w-10 fill-aqua pointer' height='35px' alt='Copy' />
      </CopyToClipboard>
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

const Box = ({ files, shareLink, doAddFiles }) => {
  return (
    <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
      <FileAdd doAddFiles={doAddFiles} />
      <FileTree files={files} />
      <CopyLink shareLink={shareLink} />
      <SocialShare />
      <Footnote />
    </div>
  )
}

export default connect(
  'selectFiles',
  'selectShareLink',
  'doAddFiles',
  Box
)
