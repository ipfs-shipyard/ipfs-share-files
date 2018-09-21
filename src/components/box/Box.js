import React from 'react'
import { translate } from 'react-i18next'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link/CopyLink'
import DownloadFiles from '../download-files/DownloadFiles'

export const Box = ({ children }) => (
  <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
    { children }
  </div>
)

export const BoxDownload = ({ files, isLoading }) => (
  <Box>
    { isLoading && <Loader /> }
    <FileTree files={files} isDownload />
    <DownloadFiles />
  </Box>
)

export const RawBoxUpload = ({ files, isLoading, shareLink, t }) => (
  <Box>
    <AddFiles />
    { isLoading && <Loader /> }
    <FileTree files={files} />
    { shareLink && <CopyLink shareLink={shareLink} /> }
    <div className='f7 gray lh-copy'>
      {t('box.footNote')}
    </div>
  </Box>
)

export const BoxUpload = translate()(RawBoxUpload)

export const RawBoxNotAvailable = ({ t }) => (
  <Box>
    <p className='mv0 orange f5 lh-title'>{t('box.missingDaemon')}</p>
    <p className='mv3 navy f6 lh-copy'>{t('box.runDaemon')}</p>
    <div className='db pa3 bg-black-80 bt bw4 br2 gray-muted f7'>
      <code className='db'>$ ipfs daemon</code>
      <code className='db'>Initializing daemon...</code>
      <code className='db truncate'>API server listening on /ip4/127.0.0.1/tcp/5001</code>
    </div>
  </Box>
)

export const BoxNotAvailable = translate()(RawBoxNotAvailable)
