import React from 'react'
import filesize from 'filesize'
import CircularProgressbar from 'react-circular-progressbar'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphSmallTick from '../../media/icons/GlyphSmallTick'

const File = ({ hash, name, type, size, progress }) => {
  if (type === 'directory') {
    size = ''
  } else {
    size = filesize(size, { round: 0, spacer: '' })
  }

  return (
    <div className='mv2 flex flex-start items-center'>
      <FileIcon name={name} type={type} />
      <span className='ph2 f6 b charcoal truncate'>{name}</span>
      <span className='f6 charcoal-muted'>{size && `(~${size})`}</span>

      <span className='ml-auto f7 charcoal-muted'>
        { progress !== 100
          ? <CircularProgressbar
            percentage={progress}
            strokeWidth={50}
            styles={{
              root: { width: 20, height: 20 },
              path: { stroke: '#69c4cd', strokeLinecap: 'butt' },
              trail: { stroke: '#ccc' }
            }} />
          : <GlyphSmallTick className='ml-auto fill-green' width='35px' alt='Tick' /> }
      </span>
    </div>
  )
}

export default File
