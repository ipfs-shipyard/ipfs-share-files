import React from 'react'

// Components
import File from '../file/File'

const FileTree = ({ files }) => (
  <div className='mb4'>
    { files ? Object.entries(files).map(([id, file]) =>
      <File
        key={`file-${id}`}
        hash={file.hash}
        name={file.name}
        size={file.size}
        progress={file.progress} />
    ) : null }
  </div>
)
export default FileTree
