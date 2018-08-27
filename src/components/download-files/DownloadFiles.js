import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'redux-bundler-react'
import CircularProgressbar from 'react-circular-progressbar'
import downloadFile from '../file/utils/download'

// Styles
import 'react-circular-progressbar/dist/styles.css'

class DownloadFiles extends React.Component {
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
    const btnClass = classnames({
      'ba b--navy bg-white navy ': this.state.progress,
      'bg-navy white glow pointer': !this.state.progress
    }, ['pa2 mb4 w-40 flex justify-center items-center br-pill f6 o-80'])

    return (
      <div className={btnClass} style={{ pointerEvents: this.state.progress && 'none' }} onClick={this.handleOnClick}>
        { this.state.progress ? <span>Packing</span> : <span>Download all</span> }
        { this.state.progress &&
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

export default connect(
  'selectFiles',
  'doGetDownloadLink',
  DownloadFiles
)
