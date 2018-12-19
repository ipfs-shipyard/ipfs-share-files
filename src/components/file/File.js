import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import CircularProgressbar from 'react-circular-progressbar'
import classnames from 'classnames'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import downloadFile from './utils/download'
import downloadArchive from './utils/archive'
import ENDPOINTS from '../../constants/endpoints'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'
import IconDownload from '../../media/icons/Download'
import GlyphAttention from '../../media/icons/GlyphAttention'

export class File extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    hash: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    progress: PropTypes.number,
    error: PropTypes.string,
    gatewayURL: PropTypes.string,
    isDownload: PropTypes.bool,
    doGetFromIPFS: PropTypes.func,
    doGetArchiveURL: PropTypes.func
  }

  state = {
    progress: 100
  }

  handleDownloadClick = async () => {
    const { id, hash, name, type, doGetFromIPFS, doGetArchiveURL } = this.props

    if (type === 'dir') {
      // This is a directory so we'll use the HTTP API to
      // be able to get an archive and download the folder.
      const { url, filename } = await doGetArchiveURL(hash)
      const updater = (progress) => this.setState({ progress: progress })
      downloadArchive(url, filename, updater)
    } else {
      // This is a file so we'll download it normally.
      const file = await doGetFromIPFS(id, hash)
      downloadFile(file, name)
    }
  }

  renderWarningSign = () => {
    const { isDownload, size, maxFileSize } = this.props

    if (isDownload && size > maxFileSize) {
      return <GlyphAttention width={25} height={25} fill='#ffcc00' alt='Warning' />
    }
  }

  renderFileStatus = () => {
    const { isDownload, type, error } = this.props
    const progress = isDownload && type === 'dir' ? this.state.progress : this.props.progress
    const fillColor = isDownload ? '#3e6175' : '#69c4cd'
    const glyphWidth = 25

    if (isDownload && progress === 100) {
      return <div className='flex items-center'>
        { this.renderWarningSign() }
        <IconDownload
          className='pointer o-80 glow'
          width={glyphWidth + 5}
          fill={fillColor}
          style={{ marginRight: '-3px' }}
          onClick={this.handleDownloadClick}
          alt='Download' />
      </div>
    } else if (error) {
      return <GlyphCancel width={glyphWidth} fill='#c7cad5' alt='Error' />
    } else if (progress === 100) {
      return <GlyphTick width={glyphWidth} fill={fillColor} alt='Tick' />
    } else {
      return (
        <div className='flex items-center'>
          { this.renderWarningSign() }
          <CircularProgressbar
            percentage={progress}
            strokeWidth={50}
            styles={{
              root: { width: 15, height: 15, marginLeft: 7, marginRight: 5 },
              path: { stroke: fillColor, strokeLinecap: 'butt' }
            }} />
        </div>
      )
    }
  }

  render () {
    const { name, type, shareHash, error, t } = this.props
    const size = filesize(this.props.size, { round: 0, spacer: '' })

    const fileNameClass = classnames({ 'charcoal': !error, 'gray': error }, ['ph2 f6 b truncate'])
    const fileSizeClass = classnames({ 'charcoal-muted': !error, 'gray': error }, ['f6'])

    return (
      <div className='mv2 flex items-center'>
        <a
          title={t('box.viewOnGateway')}
          className='flex items-center link truncate'
          style={{ outline: 'none' }}
          href={`${ENDPOINTS.gateway}/${shareHash}/${encodeURI(name)}`}
          target='_blank'
          rel='noopener noreferrer'>
          <FileIcon name={name} type={type} error={error} />
          <span className={fileNameClass}>{name}</span>
          <span className={fileSizeClass}>{size && `(~${size})`}</span>
        </a>
        <span className='ml-auto flex items-center'>{ this.renderFileStatus() }</span>
      </div>
    )
  }
}

export const TranslatedFile = translate()(File)

export default connect(
  'selectMaxFileSize',
  'selectShareHash',
  'doGetFromIPFS',
  'doGetArchiveURL',
  TranslatedFile
)
