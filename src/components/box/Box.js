import React from 'react'
import { translate } from 'react-i18next'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link/CopyLink'
import DownloadFiles from '../download-files/DownloadFiles'

export const RawBox = ({ children, t }) => (
  <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
    { children }
    <div className='f7 gray lh-copy'>
      {t('box.footNote')}
    </div>
  </div>
)

export const Box = translate()(RawBox)

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

export const RawBoxNotAvailable = ({ t }) => (
  <Box>
    <p className='mt0 navy lh-copy'>
      {t('box.missingDaemon')}
    </p>
  </Box>
)

export const BoxNotAvailable = translate()(RawBoxNotAvailable)
