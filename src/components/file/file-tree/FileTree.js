import React from 'react'

// Components
import File from '../File'

const FileTree = ({ files }) => (
  files ? files.map((file, idx) =>
    <File
      key={`file-${idx}`}
      hash={file.hash}
      name={file.name}
      size={file.size} />
  ) : null
)

export default FileTree
