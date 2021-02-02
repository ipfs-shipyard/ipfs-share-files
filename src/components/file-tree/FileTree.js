import React from 'react'
import { withTranslation, Trans } from 'react-i18next'

// Components
import File from '../file/File'

const FileTree = ({ files, isDownload }) => (
  <div>
    { files
      ? Object.entries(files).map(([id, file]) =>
      <div>
        <div className='f6 fw6 charcoal mt4 mb2'>
          <Trans i18nKey='copyLink.labelIndividual'>Share individual files:</Trans>
        </div>
        <File
          key={`file-${id}`}
          id={file.id}
          cid={file.cid}
          name={file.name}
          size={file.size}
          type={file.type}
          progress={file.progress}
          error={file.error}
          isDownload={isDownload} />
        </div>
      )
      : null }
  </div>
)

export default withTranslation('translation')(FileTree)
