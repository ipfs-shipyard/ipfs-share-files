import React from 'react'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link/CopyLink'
import DownloadFiles from '../download-files/DownloadFiles'

export const Box = ({ children }) => {
  return (
    <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
      { children }

      <div className='f7 gray lh-copy'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </div>
  )
}

export const BoxDownload = ({ files, isLoading }) => (
  <Box>
    { isLoading && <Loader /> }
    <FileTree files={files} isDownload />
    <DownloadFiles />
  </Box>
)

export const BoxUpload = ({ files, isLoading, shareLink }) => (
  <Box>
    <AddFiles />
    { isLoading && <Loader /> }
    <FileTree files={files} />
    { shareLink && <CopyLink shareLink={shareLink} /> }
  </Box>
)

export const BoxNotAvailable = () => (
  <Box>
    <p className='mt0 b'>You need to have an IPFS daemon running to upload files.</p>
  </Box>
)
