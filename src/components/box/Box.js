import React from 'react'
import { translate } from 'react-i18next'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link/CopyLink'
import DownloadFiles from '../download-files/DownloadFiles'

export const Box = ({ children, t }) => {
  return (
    <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
      { children }
      <div className='f7 gray lh-copy'>
        {t('box.footNote')}
      </div>
    </div>
  )
}

export const TranslatedBox = translate()(Box)

export const BoxDownload = ({ files, isLoading }) => (
  <TranslatedBox>
    { isLoading && <Loader /> }
    <FileTree files={files} isDownload />
    <DownloadFiles />
  </TranslatedBox>
)

export const BoxUpload = ({ files, isLoading, shareLink }) => (
  <TranslatedBox>
    <AddFiles />
    { isLoading && <Loader /> }
    <FileTree files={files} />
    { shareLink && <CopyLink shareLink={shareLink} /> }
  </TranslatedBox>
)

export const BoxNotAvailable = ({ t }) => (
  <TranslatedBox>
    <p className='mt0 navy lh-copy'>
      {t('box.missingDaemon')}</p>
  </TranslatedBox>
)

export const TranslatedBoxNotAvailable = translate()(BoxNotAvailable)
