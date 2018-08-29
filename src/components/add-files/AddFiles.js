import React from 'react'
import { connect } from 'redux-bundler-react'

// Static
import AddIcon from '../../media/icons/GlyphAdd.js'

export const AddFiles = ({ doAddFiles }) => {
  const onAddFiles = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    const fileList = ev && ev.target && ev.target.files

    doAddFiles(fileList)
  }

  return (
    <div className='mb4 o-80 glow'>
      <label htmlFor='add-files' className='flex items-center pointer'>
        <AddIcon className='fill-aqua' height='80px' style={{ marginLeft: '-16px' }} alt='Add' />
        <div className='f5 charcoal'>Add files</div>
        <input
          onChange={onAddFiles}
          id='add-files'
          className='o-0 absolute'
          style={{ pointerEvents: 'none' }}
          type='file'
          multiple />
      </label>
    </div>
  )
}

export default connect(
  'doAddFiles',
  AddFiles
)
