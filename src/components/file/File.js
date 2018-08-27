import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import CircularProgressbar from 'react-circular-progressbar'
import classnames from 'classnames'
import { connect } from 'redux-bundler-react'
import downloadFile from './utils/download'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'
import IconDownload from '../../media/icons/Download'

class File extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    hash: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    progress: PropTypes.number,
    error: PropTypes.string,
    isDownload: PropTypes.bool,
    doGetDownloadLink: PropTypes.func
  }

  state = {
    progress: null
  }

  handleDownloadClick = async () => {
    const { name, size, hash, doGetDownloadLink } = this.props
    const updater = (v) => this.setState({ progress: v })
    const { url, filename } = await doGetDownloadLink([{name, size, hash}])
    await downloadFile(url, filename, updater)
  }

  renderFileStatus = () => {
    const { isDownload, error } = this.props
    const { progress } = isDownload ? this.state : this.props
    const glyphWidth = 25

    if (isDownload && progress === null) {
      return <IconDownload className='pointer o-70 glow' fill='#3e6175' onClick={this.handleDownloadClick} width={glyphWidth} alt='Download' />
    } else if (error) {
      return <GlyphCancel width={glyphWidth} alt='Error' fill='#c7cad5' />
    } else if (progress === 100) {
      return <GlyphTick width={glyphWidth} alt='Tick' fill='#69c4cd' />
    } else {
      return (
        <CircularProgressbar
          percentage={progress}
          strokeWidth={50}
          styles={{
            root: { width: 15, height: 15, marginRight: 5 },
            path: { stroke: '#69c4cd', strokeLinecap: 'butt' }
          }} />
      )
    }
  }

  render () {
    const { name, type, error } = this.props
    let size = this.props.size

    if (type === 'directory') {
      size = ''
    } else {
      size = filesize(size, { round: 0, spacer: '' })
    }

    const fileNameClass = classnames({ 'charcoal': !error, 'gray': error }, ['ph2 f6 b truncate'])
    const fileSizeClass = classnames({ 'charcoal-muted': !error, 'gray': error }, ['f6'])

    return (
      <div className='mv2 flex flex-start items-center'>
        <FileIcon name={name} type={type} error={error} />
        <span className={fileNameClass}>{name}</span>
        <span className={fileSizeClass}>{size && `(~${size})`}</span>
        <span className='ml-auto'>{ this.renderFileStatus() }</span>
      </div>
    )
  }
}

export default connect(
  'doGetDownloadLink',
  File
)
