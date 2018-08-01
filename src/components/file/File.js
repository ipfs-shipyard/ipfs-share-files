import React from 'react'
import filesize from 'filesize'

// Components
import FileIcon from '../file/file-icon/FileIcon'

const File = ({ hash, name, type, size }) => {
  if (type === 'directory') {
    size = ''
  } else {
    size = filesize(size, { round: 0, spacer: '' })
  }

  return (
    <div className='mv2 flex flex-start items-center'>
      <FileIcon name={name} type={type} />
      <span className='ph2 f6 b charcoal'>{name}</span>
      <span className='f6 charcoal-muted'>{size && `(~${size})`}</span>
    </div>
  )
}

export default File
