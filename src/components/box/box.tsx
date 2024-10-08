import classNames from 'classnames'
import React, { forwardRef, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { Trans, useTranslation } from 'react-i18next'
import { useFiles, useFilesDispatch, useAddFiles } from '../../hooks/use-files'
import { useHelia } from '../../hooks/use-helia'
import { useDownloadInfo } from '../../providers/download-provider'
import { AddFiles } from '../add-files/add-files'
import { DownloadFiles } from '../download-files/download-files'
import { FileTree } from '../file-tree/file-tree'
import Loader from '../loader/loader'
import { ShareAllFiles } from '../share-all-files/share-all-files'

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

export const BoxDownload = (): React.JSX.Element => {
  const dispatch = useFilesDispatch()
  const { files, filesToFetch } = useFiles()
  const { cid, filename } = useDownloadInfo()
  const { helia, nodeInfo } = useHelia()
  const { multiaddrs } = nodeInfo ?? { multiaddrs: [] }
  const isLoading = filesToFetch.length !== 0 || Object.keys(files).length === 0

  useEffect(() => {
    if (helia == null) return
    // if (multiaddrs.length === 0) return
    if (cid == null) return
    dispatch({ type: 'fetch_start', cid, filename })
  }, [cid, filename, helia, multiaddrs.length])

  return (
    <Box>
      { isLoading && <Loader /> }
      <FileTree isDownload />
      <DownloadFiles isLoading={isLoading} />
    </Box>
  )
}

export const BoxAdd = (): React.JSX.Element => {
  const dispatch = useFilesDispatch()
  const heliaState = useHelia()
  const doAddFiles = useAddFiles(dispatch, heliaState)
  const [{ isOver }, drop] = useDrop<{ files: File[], type: string }, Promise<void>, { isOver: boolean }>({
    accept: [NativeTypes.FILE],
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    drop: async ({ files, ...rest }, monitor) => {
      // FIXME: fix folder drag n drop: it fails and we should display a message to the user that folder drop currently doesn't work
      if (files == null) return
      // still can't tell a dir from a file on the web web in 2021 XD  https://stackoverflow.com/a/25095250/11518426
      files = files.filter(f => {
        if (f.type == null) return false
        return !(f.size % 4096 === 0)
      })
      // check: https://react-dnd.github.io/react-dnd/docs/api/use-drop
      // this is the handler that lets you call the function `doAddFiles`
      doAddFiles(files)
    }
  })

  return <Box ref={drop} className={isOver ? '' : 'bg-gray-muted'} >
    <AddFiles doAddFiles={doAddFiles} />
    {/* { isLoading && <Loader /> } */}
    <FileTree />
    <ShareAllFiles />
  </Box>
}

// TODO this text is all outdated
export const BoxNotAvailable: React.FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation('translation')
  return (
    <Box>
      <p className='mv0 red f5 lh-title'>{t('helia-error.title')}</p>
      <p className='mv3 navy f6 lh-copy'>
        {t('helia-error.message', { message: error.message })}
      </p>
      <p className='mv3 navy f6 lh-copy'>
        {t('helia-error.more-details')}
      </p>
      <p className='mv3 navy f6 lh-copy'>
        <Trans i18nKey="helia-error.refresh-page">
          You may need to <a className="link aqua underline-hover" href={window.location.href}>refresh the page</a> to try re-instantiating your Helia node.
        </Trans>
      </p>
      <p className='mv3 navy f6 lh-copy'>
        <Trans i18nKey='helia-error.open-issue'>
          If the problem persists, please <a className='link aqua underline-hover' href='https://github.com/ipfs-shipyard/ipfs-share-files' target='_blank' rel='noopener noreferrer'>open an issue</a>.
        </Trans>
      </p>
    </Box>
  )
}
