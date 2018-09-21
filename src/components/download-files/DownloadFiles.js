import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import CircularProgressbar from 'react-circular-progressbar'
import downloadFile from '../file/utils/download'

// Styles
import 'react-circular-progressbar/dist/styles.css'

export class DownloadFiles extends React.Component {
  static propTypes = {
    files: PropTypes.object,
    doGetDownloadLink: PropTypes.func
  }

  state = {
    progress: null
  }

  handleOnClick = async () => {
    const { files, doGetDownloadLink } = this.props
    const updater = (v) => this.setState({ progress: v })
    const { url, filename } = await doGetDownloadLink(Object.values(files))
    await downloadFile(url, filename, updater)
  }

  render () {
    const { t } = this.props
    const btnClass = classnames({
      'ba b--navy bg-white navy ': this.state.progress,
      'bg-navy white glow pointer': !this.state.progress
    }, ['pa2 mb2 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} style={{ pointerEvents: this.state.progress && 'none' }} onClick={this.handleOnClick}>
        { this.state.progress ? <span>{t('downloadFiles.downloading')}</span> : <span>{t('downloadFiles.downloadAll')}</span> }
        { this.state.progress && this.state.progress !== Infinity &&
          <CircularProgressbar
            percentage={this.state.progress}
            strokeWidth={50}
            styles={{
              root: { width: 12, height: 12, marginLeft: 10 },
              path: { stroke: '#3e6175', strokeLinecap: 'butt' }
            }} /> }
      </div>
    )
  }
}

export const TranslatedDownloadFiles = translate()(DownloadFiles)

export default connect(
  'selectFiles',
  'doGetDownloadLink',
  TranslatedDownloadFiles
)
