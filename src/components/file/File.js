import React from 'react'
import filesize from 'filesize'
import CircularProgressbar from 'react-circular-progressbar'
import classnames from 'classnames'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'

const File = ({ hash, name, type, size, progress, error }) => {
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

  const fileNameClass = classnames({ 'charcoal': !error, 'gray': error }, ['ph2 f6 b truncate'])
  const fileSizeClass = classnames({ 'charcoal-muted': !error, 'gray': error }, ['f6'])

  return (
    <div className='mv2 flex flex-start items-center'>
      <FileIcon name={name} type={type} error={error} />
      <span className={fileNameClass}>{name}</span>
      <span className={fileSizeClass}>{size && `(~${size})`}</span>
      <span className='ml-auto'>{ renderFileStatus(progress) }</span>
    </div>
  )
}

export default File
