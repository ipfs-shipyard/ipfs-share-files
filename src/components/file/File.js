import React from 'react'
import filesize from 'filesize'
import CircularProgressbar from 'react-circular-progressbar'
import classnames from 'classnames'
import { connect } from 'redux-bundler-react'
import downloadFile from './utils/download'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'
import IconDownload from '../../media/icons/Download'

const File = ({ id, hash, name, type, size, progress, error, isDownload, doGetDownloadLink }) => {
  if (type === 'directory') {
    size = ''
  } else {
    size = filesize(size, { round: 0, spacer: '' })
  }

  const renderFileStatus = (progress) => {
    const glyphWidth = 25

    if (progress === undefined) {
      return null
    } else if (error) {
      return <GlyphCancel width={glyphWidth} alt='Error' fill='#c7cad5' />
    } else if (progress === 100) {
      return <GlyphTick width={glyphWidth} alt='Tick' fill='#69c4cd' />
    } else {
      return (
        <CircularProgressbar
          percentage={progress}
          strokeWidth={50}
          styles={{
            root: { width: 15, height: 15, marginRight: 5 },
            path: { stroke: '#69c4cd', strokeLinecap: 'butt' }
          }} />
      )
    }
  }

  const renderDownload = () => {
    const glyphWidth = 25

    const handleDownloadClick = async () => {
      const updater = (v) => console.log(v)
      const { url, filename } = await doGetDownloadLink([{name, size, hash}])
      const { abort } = await downloadFile(url, filename, updater)
    }

    return <IconDownload className='pointer o-70 glow' fill='#3e6175' onClick={handleDownloadClick} width={glyphWidth} alt='Download' />
  }

  const fileNameClass = classnames({ 'charcoal': !error, 'gray': error }, ['ph2 f6 b truncate'])
  const fileSizeClass = classnames({ 'charcoal-muted': !error, 'gray': error }, ['f6'])

  return (
    <div className='mv2 flex flex-start items-center'>
      <FileIcon name={name} type={type} error={error} />
      <span className={fileNameClass}>{name}</span>
      <span className={fileSizeClass}>{size && `(~${size})`}</span>
      { isDownload
        ? <span className='ml-auto'>{ renderDownload() }</span>
        : <span className='ml-auto'>{ renderFileStatus(progress) }</span> }
    </div>
  )
}

export default connect(
  'doGetDownloadLink',
  File
)
