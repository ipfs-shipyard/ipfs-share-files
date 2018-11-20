import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import downloadFile from '../file/utils/download'
import archiveFiles from '../file/utils/archive'

// Styles
import 'react-circular-progressbar/dist/styles.css'

export class DownloadFiles extends React.Component {
  static propTypes = {
    files: PropTypes.object,
    hasDirs: PropTypes.bool,
    doDownloadFile: PropTypes.func,
    doArchiveFiles: PropTypes.func
  }

  state = {
    isDownloading: false
  }

  handleOnClick = async () => {
    const { hasDirs } = this.props

    this.setState({ isDownloading: true })

    if (hasDirs) {
      // File tree has directories so we'll use the public gateway to be
      // able to get an archive and download the folder structure as is.
      const { doArchiveFiles } = this.props
      const updater = (progress) => progress === 100 && this.setState({ isDownloading: false })

      const { url, filename } = await doArchiveFiles()
      archiveFiles(url, filename, updater)
    } else {
      // File tree doesn't have directories so we'll download the files
      // one by one using the best connection possible.
      const { files, doDownloadFile } = this.props

      for (const file of Object.values(files)) {
        const fileContent = await doDownloadFile(file.id, file.hash)
        downloadFile(fileContent, file.name)
      }

      this.setState({ isDownloading: false })
    }
  }

  render () {
    const { t } = this.props
    const btnClass = classnames({
      'ba b--navy bg-white navy no-pointer-events': this.state.isDownloading === true,
      'bg-navy white glow pointer': this.state.isDownloading === false
    }, ['pa2 mb2 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} onClick={this.handleOnClick}>
        { this.state.isDownloading === false
          ? <span>{t('downloadFiles.downloadAll')}</span>
          : <div className='flex items-center'>
            {t('downloadFiles.downloading')}
          </div> }
      </div>
    )
  }
}

export const TranslatedDownloadFiles = translate()(DownloadFiles)

export default connect(
  'selectFiles',
  'selectHasDirs',
  'doDownloadFile',
  'doArchiveFiles',
  TranslatedDownloadFiles
)
