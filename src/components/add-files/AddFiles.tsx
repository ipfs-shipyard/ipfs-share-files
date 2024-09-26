import React, { type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IGNORED_FILES } from '../../constants/files'

const parseFiles = (ev: ChangeEvent<HTMLInputElement>): File[] => {
  ev.preventDefault()
  ev.stopPropagation()

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
  return Object.values(ev?.target?.files || {})
}

export const AddFiles = ({ doAddFiles }: { doAddFiles(files: File[]): void }): React.JSX.Element => {
  const { t } = useTranslation()
  const onAddFiles = (ev): void => {
    const filesList = parseFiles(ev)
    doAddFiles(filesList)
  }

  const onAddFolder = (ev): void => {
    const filesList = parseFiles(ev).filter(({ name }) => !IGNORED_FILES.includes(name))
    doAddFiles(filesList)
  }

  return (
    <div className="o-80 glow">
      <div className="flex flex-column justify-center items-start">
        <label className="flex items-center pointer">
          <div className='mw3 fill-navy'>
            <svg xmlns="http://www.w3.org/2000/svg" width="68" viewBox="20 10 80 74">
              <title>{t('addFiles')}</title>
              <path d="M71.13 28.87a29.88 29.88 0 100 42.26 29.86 29.86 0 000-42.26zm-18.39 37.6h-5.48V52.74H33.53v-5.48h13.73V33.53h5.48v13.73h13.73v5.48H52.74z"/>
            </svg>
          </div>
          <div className="f3 fw4 montserrat">{t('addFiles')}</div>
          <input
            onChange={onAddFiles}
            id="add-files"
            className="dn"
            style={{ pointerEvents: 'none' }}
            type="file"
            multiple
          />
        </label>
        <label htmlFor="add-folder" className="flex items-center pointer">
          <div className="f6 charcoal underline-hover ml5">{t('addFolder')}</div>
          <input
            onChange={onAddFolder}
            id="add-folder"
            className="dn"
            style={{ pointerEvents: 'none' }}
            type="file"
            multiple
            // @ts-expect-error react types don't know about these attributes
            // eslint-disable-next-line react/no-unknown-property
            directory="true" webkitdirectory="true" mozdirectory="true"
          />
        </label>
      </div>
    </div>
  )
}
