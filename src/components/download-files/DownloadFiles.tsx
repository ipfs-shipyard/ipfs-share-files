import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { CircularProgressbar } from 'react-circular-progressbar'
import downloadArchive from '../file/utils/archive'
import { FileState } from '../../providers/FilesProvider'
// import downloadFile from '../file/utils/download'

// Styles
import 'react-circular-progressbar/dist/styles.css'
import './DownloadFiles.css'

export const DownloadFiles = ({files, isLoading}: {files: Record<string, FileState>, isLoading: boolean}) => {
  const [progress, setProgress] = useState(100)

  const handleOnClick = useCallback(async () => {
    // const fs = selectUnixFs()
    // console.log('download click fs', fs)

    if (Object.keys(files).length === 1) {
      // just create a file object from Helia unixfs
      // const { url, filename } = await doGetFileURL()
      // downloadFile(url, filename)
      alert('FIX_ME')
    } else {
      console.log({files})
      // create a directory
      // TODO
      // @ts-expect-error
      const { url, filename } = await doGetArchiveURL()
      const updater = (progress) => setProgress(progress)
      downloadArchive(url, filename, updater)
    }
  }, [files])

  const { t } = useTranslation()
  const btnClass = classnames({
    'ba b--navy bg-white navy no-pointer-events': progress !== 100,
    'bg-navy white glow pointer': progress === 100,
    'no-pointer-events o-50': isLoading,
    'o-80': !isLoading
  }, ['DownloadFilesButton w-100-ns pv2 ph4 mb2 mt3 flex justify-center items-center br-pill f4 montserrat'])

  return (
    <div className='w5 center'>
      <button className={btnClass} onClick={handleOnClick}>
        { progress === 100
          ? <span className='truncate'>{ Object.keys(files).length > 1 ? t('downloadFiles.downloadAll') : t('downloadFiles.download') }</span>
          : <div className='flex items-center'>
            {t('downloadFiles.downloading')}
            <CircularProgressbar
              value={progress}
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
