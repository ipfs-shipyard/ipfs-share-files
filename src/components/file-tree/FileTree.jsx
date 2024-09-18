import React from 'react'
import { withTranslation, Trans } from 'react-i18next'

// Components
import File from '../file/File'

const FileTree = ({ files, isDownload }) => {
  const filesMap = Object.entries(files)

  return (
  <div className='mt4'>
     {!isDownload && filesMap.length > 1 && (
     <div className='f5 montserrat fw4 charcoal mb2'>
      <Trans i18nKey='copyLink.labelIndividual'>Share individual files:</Trans>
    </div>)}
    { files
      ? Object.entries(files).map(([id, file]) =>
        <File
          key={`file-${id}`}
          id={file.id}
          cid={file.cid}
          name={file.name}
          size={Number(file.size)}
          type={file.type}
          progress={file.progress}
          error={file.error}
          isDownload={isDownload} />
      )
      : null }
  </div>)
}
export default withTranslation('translation')(FileTree)
