import React, { forwardRef } from 'react'
import { withTranslation, Trans } from 'react-i18next'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import classNames from 'classnames'
import { connect } from 'redux-bundler-react'

// Components
import Loader from '../loader/Loader'
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link/CopyLink'
import DownloadFiles from '../download-files/DownloadFiles'

export const Box = ({ children }) => (
  <div className='center ml0-l mb4 mt2-l mb0-l pa4 pb3 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
    { children }
  </div>
)

export const BoxDownload = ({ files, isLoading, showSizeWarning }) => (
  <Box>
    { isLoading && <Loader /> }
    { showSizeWarning && <div className='mb4' style={{ borderLeft: '3px solid #ffcc00' }}>
      <p className='mv0 pl3 navy f6 lh-copy'>
        <Trans i18nKey='box.largeFilesWarning'>
          You may experience issues when downloading files larger than 1GB. Please use <a className='link aqua underline-hover' href='https://github.com/ipfs-shipyard/ipfs-desktop/' target='_blank' rel='noopener noreferrer'>IPFS Desktop</a>
          or <a className='link aqua underline-hover' href='https://github.com/ipfs-shipyard/ipfs-companion/' target='_blank' rel='noopener noreferrer'>IPFS Companion</a> to do so.
        </Trans>
      </p>
    </div> }
    <FileTree files={files} isDownload />
    <DownloadFiles />
  </Box>
)

export const RawBoxAdd = ({ files, isLoading, shareLink, doAddFiles, t }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    drop: async ({ files }) => {
      console.log(files)
      if (!files) return null
      // check: https://react-dnd.github.io/react-dnd/docs/api/use-drop
      // this is the handler that lets you call the function `doAddFiles`
    }
  })

  return <Box ref={drop} className={isOver && 'isOver'} >
    <AddFiles />
    { isLoading && <Loader /> }
    <FileTree files={files} />
    { shareLink && <CopyLink shareLink={shareLink} /> }
  </Box>
}

export const BoxAdd = withTranslation('translation')(
  connect(
    'doAddFiles',
    RawBoxAdd
  )
)

export const RawBoxNotAvailable = ({ t }) => (
  <Box>
    <p className='mv0 orange f5 lh-title'>{t('box.missingDaemon')}</p>
    <p className='mv3 navy f6 lh-copy'>
      <Trans i18nKey='box.runningDaemon'>
        You need a <a className='link aqua underline-hover' href='https://docs.ipfs.io/introduction/usage/' target='_blank' rel='noopener noreferrer'>running daemon</a> to add files to IPFS.
      </Trans>
    </p>
    <p className='mv3 navy f6 lh-copy'>
      <Trans i18nKey='box.configureDaemon'>
        Make sure you <a className='link aqua underline-hover' href='https://github.com/ipfs-shipyard/ipfs-share-files#ipfs-daemon' target='_blank' rel='noopener noreferrer'>configure your IPFS API</a> to allow cross-origin (CORS) requests:
      </Trans>
    </p>
    <div className='pa3 bg-black-80 bt bw4 br2 gray-muted f7 nowrap overflow-x-scroll'>
      <code className='db'>$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["{ window.location.origin }", "https://share.ipfs.io"]'</code>
      <code className='db'>$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'</code>
    </div>
    <p className='mv3 navy f6 lh-copy'>{t('box.runDaemon')}</p>
    <div className='pa3 bg-black-80 bt bw4 br2 gray-muted f7 nowrap overflow-x-scroll'>
      <code className='db'>$ ipfs daemon</code>
      <code className='db'>Initializing daemon...</code>
      <code className='db'>API server listening on /ip4/127.0.0.1/tcp/5001</code>
    </div>
  </Box>
)

export const BoxNotAvailable = withTranslation('translation')(RawBoxNotAvailable)
