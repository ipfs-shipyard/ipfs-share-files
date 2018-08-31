import React from 'react'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link//CopyLink'
import DownloadFiles from '../download-files//DownloadFiles'

const Footnote = () => (
  <div className='f7 gray lh-copy'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
)

const Box = ({ isDownload, files, shareLink, isLoading }) => {
  const boxClass = 'mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'

  const renderUpload = () => (
    <div className={boxClass}>
      <AddFiles />
      { isLoading && <Loader /> }
      <FileTree files={files} isDownload={isDownload} />
      { shareLink && <CopyLink shareLink={shareLink} /> }
      <Footnote />
    </div>
  )

  const renderDownload = () => (
    <div className={boxClass}>
      { isLoading && <Loader /> }
      <FileTree files={files} isDownload />
      <DownloadFiles />
      <Footnote />
    </div>
  )

  return isDownload ? renderDownload() : renderUpload()
}

export default Box
