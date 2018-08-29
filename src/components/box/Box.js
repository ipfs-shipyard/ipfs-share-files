import React from 'react'

// Components
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link//CopyLink'
import DownloadFiles from '../download-files//DownloadFiles'

const Footnote = () => (
  <div className='f7 gray lh-copy'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
)

const Box = ({ isDownload, files, shareLink }) => {
  const boxClass = 'mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'

  return (
    isDownload
      ? <div className={boxClass}>
        <FileTree files={files} isDownload />
        <DownloadFiles />
        <Footnote />
      </div>
      : <div className={boxClass}>
        <AddFiles />
        <FileTree files={files} isDownload={isDownload} />
        { shareLink && <CopyLink shareLink={shareLink} /> }
        <Footnote />
      </div>
  )
}

export default Box
