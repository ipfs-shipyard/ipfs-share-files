import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import CircularProgressbar from 'react-circular-progressbar'
import downloadArchive from '../file/utils/archive'

// Styles
import 'react-circular-progressbar/dist/styles.css'

export class DownloadFiles extends React.Component {
  static propTypes = {
    doGetArchiveURL: PropTypes.func
  }

  state = {
    progress: 100
  }

  handleOnClick = async () => {
    const { doGetArchiveURL } = this.props
    const { url, filename } = await doGetArchiveURL()
    const updater = (progress) => this.setState({ progress: progress })
    downloadArchive(url, filename, updater)
  }

  render () {
    const { existFiles, t } = this.props
    const { progress } = this.state
    const btnClass = classnames({
      'ba b--navy bg-white navy no-pointer-events': progress !== 100,
      'bg-navy white glow pointer': progress === 100
    }, ['pa2 mb2 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} onClick={this.handleOnClick}>
        { progress === 100
          ? <span>{ existFiles > 1 ? t('downloadFiles.downloadAll') : t('downloadFiles.download') }</span>
          : <div className='flex items-center'>
            {t('downloadFiles.downloading')}
            <CircularProgressbar
              percentage={progress}
              strokeWidth={50}
              styles={{
                root: { width: 15, height: 15, marginLeft: 7, marginRight: 5 },
                path: { stroke: '#3e6175', strokeLinecap: 'butt' }
              }} />
          </div> }
      </div>
    )
  }
}

export const TranslatedDownloadFiles = translate()(DownloadFiles)

export default connect(
  'selectExistFiles',
  'doGetArchiveURL',
  TranslatedDownloadFiles
)
