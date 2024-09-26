import classNames from 'classnames'
import React, { forwardRef } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { Trans, useTranslation } from 'react-i18next'
import { useAddFiles, useFilesDispatch } from '../../hooks/useFiles'
import { useHelia } from '../../hooks/useHelia'
import { type FileState, type ShareLinkState } from '../../providers/FilesProvider'
import { AddFiles } from '../add-files/AddFiles'
import { CopyLink } from '../copy-link/CopyLink'
import { DownloadFiles } from '../download-files/DownloadFiles'
import { FileTree } from '../file-tree/FileTree'
import Loader from '../loader/Loader'

export const Box = forwardRef<HTMLDivElement, { children: any, className?: string }>((props, ref) => {
  const { children, className } = props
  return (
    <div ref={ref} className={classNames('center ml0-l mb4 mt2-l mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white', className)}>
      { children }
    </div>
  )
})
// Component definition is missing display [nameeslintreact/display-name](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md)
Box.displayName = 'Box'

export const BoxDownload = ({ files, isLoading }: { files: Record<string, FileState>, isLoading: boolean }) => (
  <Box>
    { isLoading && <Loader /> }
    <FileTree files={files} isDownload />
    <DownloadFiles files={files} isLoading={isLoading} />
  </Box>
)

export const BoxAdd = ({ files, isLoading, shareLink }: { files: Record<string, FileState>, isLoading: boolean, shareLink: ShareLinkState }) => {
  const dispatch = useFilesDispatch()
  const heliaState = useHelia()
  const doAddFiles = useAddFiles(dispatch, heliaState)
  const [{ isOver }, drop] = useDrop<{ files: File[], type: string }, Promise<void>, { isOver: boolean }>({
    accept: [NativeTypes.FILE],
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    drop: async ({ files }) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!files) return
      // still can't tell a dir from a file on the web web in 2021 XD  https://stackoverflow.com/a/25095250/11518426
      files = files.filter(f => !(!f.type && f.size % 4096 === 0))
      // check: https://react-dnd.github.io/react-dnd/docs/api/use-drop
      // this is the handler that lets you call the function `doAddFiles`
      doAddFiles(files)
    }
  })

  // console.log('shareLink', shareLink)

  return <Box ref={drop} className={isOver ? '' : 'bg-gray-muted'} >
    <AddFiles doAddFiles={doAddFiles} />
    { isLoading && <Loader /> }
    <FileTree files={files} />
    <CopyLink shareLink={shareLink.link} />
  </Box>
}

// TODO this text is all outdated
export const BoxNotAvailable = (): React.JSX.Element => {
  const { t } = useTranslation('myNamespace')
  return (
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
}
