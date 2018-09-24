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
    downloadFile(url, filename, updater)
  }

  render () {
    const { t } = this.props
    const btnClass = classnames({
      'ba b--navy bg-white navy no-pointer-events': this.state.progress !== null,
      'bg-navy white glow pointer': this.state.progress === null
    }, ['pa2 mb2 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} onClick={this.handleOnClick}>
        { this.state.progress === null
          ? <span>{t('downloadFiles.downloadAll')}</span>
          : <div className='flex items-center'>
            {t('downloadFiles.downloading')}
            <CircularProgressbar
              percentage={this.state.progress}
              strokeWidth={50}
              styles={{
                root: { width: 12, height: 12, marginLeft: 10 },
                path: { stroke: '#3e6175', strokeLinecap: 'butt' }
              }} />
          </div> }
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
