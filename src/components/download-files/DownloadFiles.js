import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import downloadArchive from '../file/utils/archive'

// Styles
import 'react-circular-progressbar/dist/styles.css'

export class DownloadFiles extends React.Component {
  static propTypes = {
    doGetArchiveURL: PropTypes.func
  }

  state = {
    isDownloading: false
  }

  handleOnClick = async () => {
    const { doGetArchiveURL } = this.props
    this.setState({ isDownloading: true })
    const { url, filename } = await doGetArchiveURL()
    const updater = (progress) => progress === 100 && this.setState({ isDownloading: false })
    downloadArchive(url, filename, updater)
  }

  render () {
    const { t } = this.props
    const { isDownloading } = this.state
    const btnClass = classnames({
      'ba b--navy bg-white navy no-pointer-events': isDownloading === true,
      'bg-navy white glow pointer': isDownloading === false
    }, ['pa2 mb2 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} onClick={this.handleOnClick}>
        { isDownloading === false
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
  'doGetArchiveURL',
  TranslatedDownloadFiles
)
