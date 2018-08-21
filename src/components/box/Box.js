import React from 'react'
import { connect } from 'redux-bundler-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Components
import FileAdd from '../file//file-add/FileAdd'
import FileTree from '../file//file-tree/FileTree'
import CopyIcon from '../../media/icons/GlyphCopy.js'

const CopyLink = ({ shareLink }) => (
  <div className='mb4'>
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
      { shareLink && <CopyLink shareLink={shareLink} /> }
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
