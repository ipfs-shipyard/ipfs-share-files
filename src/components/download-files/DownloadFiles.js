import React from 'react'
import { connect } from 'redux-bundler-react'
import downloadFile from '../file/utils/download'

const DownloadFiles = ({ files, doGetDownloadLink }) => {
  const handleOnClick = async () => {
    const updater = (v) => console.log(v)
    const { url, filename } = await doGetDownloadLink(Object.values(files))
    const { abort } = await downloadFile(url, filename, updater)
  }

  return (
    <div className='mb4 w-40 o-70 glow'>
      <div className='pa2 flex justify-center items-center ba b--navy br-pill f6 navy pointer' onClick={handleOnClick}>
        <span>Download all</span>
      </div>
    </div>
  )
}

export default connect(
  'selectFiles',
  'doGetDownloadLink',
  DownloadFiles
)
