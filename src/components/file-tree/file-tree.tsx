import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useFiles } from '../../hooks/use-files'
import { File } from '../file/file'

export const FileTree = ({ isDownload }: { isDownload?: boolean }): React.ReactNode => {
  const { t } = useTranslation()
  const { files } = useFiles()
  const filesMap = Object.entries(files)

  return (
  <div className=''>
     {isDownload === false && filesMap.length > 1 && (
     <div className='f5 montserrat fw4 charcoal mb2'>
      <Trans t={t} i18nKey='copyLink.labelIndividual'>Share individual files:</Trans>
    </div>)}
    {
      filesMap.map(([id, file]) =>
        <File
          key={`file-${id}`}
          file={file}
          isDownload={isDownload} />
      )
    }
  </div>)
}
