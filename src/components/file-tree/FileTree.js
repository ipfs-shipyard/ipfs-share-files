import React from 'react'

// Components
import File from '../file/File'

const FileTree = ({ files, isDownload }) => (
  <div className='mb4'>
    { files ? Object.entries(files).map(([id, file]) =>
      <File
        key={`file-${id}`}
        id={file.id}
        hash={file.hash}
        name={file.name}
        size={file.size}
        type={file.type}
        progress={file.progress}
        error={file.error}
        isDownload={isDownload} />
    ) : null }
  </div>
)

export default FileTree
