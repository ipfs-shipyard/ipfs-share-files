import classnames from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { useFiles } from '../../hooks/useFiles'
import { useHelia } from '../../hooks/useHelia'
import 'react-circular-progressbar/dist/styles.css'
import './DownloadFiles.css'
import { downloadAllFiles, downloadCidAsFile } from '../file/utils/download'

export interface DownloadFilesProps {
  isLoading: boolean
}

export const DownloadFiles: React.FC<DownloadFilesProps> = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useTranslation()
  const [progress, setProgress] = useState<number | null>(100)
  const { files, shareLink } = useFiles()
  const { cid: folderCid } = shareLink
  const { helia, unixfs } = useHelia()

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((ev) => {
    if (isLoading || helia == null || unixfs == null || folderCid == null) {
      console.warn('DownloadFilesButton: not ready to download.')
      return
    }

    void (async () => {
      if (Object.keys(files).length === 1) {
        const file = Object.values(files)[0]
        const { cid, name } = file
        await downloadCidAsFile({ unixfs, cid, filename: name })
      } else {
        await downloadAllFiles({ files, unixfs, cid: folderCid })
      }
    })()
  }, [files, helia, unixfs, folderCid])

  const btnClass = useMemo(() => {
    return classnames({
      'ba b--navy bg-white navy no-pointer-events': progress !== 100,
      'bg-navy white glow pointer': progress === 100,
      'no-pointer-events o-50': (isLoading || helia == null || unixfs == null),
      'o-80': !(isLoading && helia != null && unixfs != null)
    }, ['DownloadFilesButton w-100-ns pv2 ph4 mb2 mt3 flex justify-center items-center br-pill f4 montserrat'])
  }, [progress, isLoading, helia, unixfs])

  return (
    <div className='w5 center'>
      <button className={btnClass} onClick={handleOnClick}>
        { progress === 100
          ? <span className='truncate'>{ Object.keys(files).length > 1 ? t('downloadFiles.downloadAll') : t('downloadFiles.download') }</span>
          : <div className='flex items-center'>
            {t('downloadFiles.downloading')}
            <CircularProgressbar
              value={progress ?? 0}
              strokeWidth={50}
              styles={{
                root: { width: 15, height: 15, marginLeft: 7, marginRight: 5 },
                path: { stroke: '#3e6175', strokeLinecap: 'butt' }
              }} />
          </div> }
      </button>
    </div>
  )
}
