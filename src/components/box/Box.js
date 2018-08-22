import React from 'react'
import { connect } from 'redux-bundler-react'

// Components
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link//CopyLink'

const Footnote = () => (
  <div className='f7 gray lh-copy'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
)

const Box = ({ files, shareLink, doAddFiles }) => {
  return (
    <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
      <AddFiles doAddFiles={doAddFiles} />
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
