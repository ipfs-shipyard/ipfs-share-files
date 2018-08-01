import React from 'react'

// Components
import File from '../File'

const FileTree = ({ files }) => (
  files ? Object.entries(files).map(([id, file]) =>
    <File
      key={`file-${id}`}
      hash={file.hash}
      name={file.name}
      size={file.size}
      progress={file.progress} />
  ) : null
)

export default FileTree
