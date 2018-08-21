import React from 'react'
import { connect } from 'redux-bundler-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Components
import FileAdd from '../file//file-add/FileAdd'
import FileTree from '../file//file-tree/FileTree'

const CopyLink = ({ shareLink }) => (
  <div className='mb4'>
    <div className='f7 gray'>Copy link to send files:</div>
    <div className='pa1 mt3 w-100 flex items-center br-pill bg-light-gray'>
      <div className='ph2 w-80 f7 navy truncate'>
        { shareLink }
      </div>
      <CopyToClipboard text={shareLink}>
        <div className='pa2 w-20 flex items-center justify-center br-pill bg-navy f7 white o-80 glow pointer'>
          Copy
        </div>
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
