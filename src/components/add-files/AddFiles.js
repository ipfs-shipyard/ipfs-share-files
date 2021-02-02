import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import { IGNORED_FILES } from '../../constants/files'

// Static
import AddIcon from '../../media/icons/GlyphAdd.js'

const parseFiles = ev => {
  ev.preventDefault()
  ev.stopPropagation()

  return Object.values(ev?.target?.files || {})
}

export const AddFiles = ({ t, doAddFiles }) => {
  const onAddFiles = (ev) => {
    const filesList = parseFiles(ev)
    doAddFiles(filesList)
  }

  const onAddFolder = (ev) => {
    const filesList = parseFiles(ev).filter(({ name }) => !IGNORED_FILES.includes(name))
    doAddFiles(filesList)
  }

  return (
    <div className="mb4 o-80 glow">
      <div className="flex flex-column justify-center items-start">
        <label className="flex items-center pointer">
          <AddIcon className="fill-aqua" height="80px" style={{ marginLeft: '-16px' }} alt={t('addFiles')}/>
          <div className="f5 charcoal">{t('addFiles')}</div>
          <input
            onChange={onAddFiles}
            id="add-files"
            className="o-0 absolute"
            style={{ pointerEvents: 'none' }}
            type="file"
            multiple
          />
        </label>
        <label htmlFor="add-folder" className="flex items-center pointer" style={{ marginLeft: '64px', marginTop: -20 }}>
          <div className="f6 charcoal underline">{t('addFolder')}</div>
          <input
            onChange={onAddFolder}
            id="add-folder"
            className="o-0 absolute"
            style={{ pointerEvents: 'none' }}
            type="file"
            multiple directory="true" webkitdirectory="true" mozdirectory="true"
          />
        </label>
      </div>
    </div>
  )
}

export const TranslatedAddFiles = withTranslation('translation')(AddFiles)

export default connect('doAddFiles', TranslatedAddFiles)
