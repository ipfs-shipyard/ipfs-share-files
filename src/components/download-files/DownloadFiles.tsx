import classnames from 'classnames'
import { CID } from 'multiformats/cid'
import React, { useCallback, useMemo, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { useFiles } from '../../hooks/useFiles'
import { useHelia } from '../../hooks/useHelia'
import { useDownloadInfo } from '../../providers/download-provider'
import 'react-circular-progressbar/dist/styles.css'
import './DownloadFiles.css'
import { downloadAllFiles, downloadCidAsFile } from '../file/utils/download'

export interface DownloadFilesProps {
  isLoading: boolean
}

export const DownloadFiles: React.FC<DownloadFilesProps> = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useTranslation()
  const [progress, setProgress] = useState<number | null>(100)
  const { files } = useFiles()
  const { helia, unixfs } = useHelia()
  const { cid: groupCID } = useDownloadInfo()

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((ev) => {
    if (isLoading || helia == null || unixfs == null) return
    // const fs = selectUnixFs()
    // console.log('download click fs', fs)
    void (async () => {
      if (Object.keys(files).length === 1) {
        const file = Object.values(files)[0]
        const { cid, name } = file
        if (cid == null) {
          // eslint-disable-next-line no-alert
          alert('FIX_ME, no CID for file')
          return
        }
        await downloadCidAsFile({ unixfs, cid, filename: name })
      } else {
        // TODO: better handling of potentially empty groupCID here
        const cid = CID.parse(groupCID ?? '')
        await downloadAllFiles({ files, unixfs, cid })
      }
    })()
  }, [files, helia, unixfs])

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
      { /* eslint-disable-next-line @typescript-eslint/no-misused-promises */ }
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
