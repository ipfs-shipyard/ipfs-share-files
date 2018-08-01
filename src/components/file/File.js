import React from 'react'
import filesize from 'filesize'

// Components
import FileIcon from '../file/file-icon/FileIcon'

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

      <span className='ml3 f5 charcoal'>{progress}/100</span>
    </div>
  )
}

export default File
