import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'
import { CircularProgressbar } from 'react-circular-progressbar'
import classnames from 'classnames'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import downloadFile from './utils/download'
import downloadArchive from './utils/archive'
import ENDPOINTS from '../../constants/endpoints'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Components
import FileIcon from '../file/file-icon/FileIcon'

// Styles
import './File.css'
import 'react-circular-progressbar/dist/styles.css'

// Static
import GlyphTick from '../../media/icons/GlyphTick'
import GlyphCancel from '../../media/icons/GlyphCancel'
import IconDownload from '../../media/icons/Download'
import GlyphAttention from '../../media/icons/GlyphAttention'

export class File extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    cid: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
    progress: PropTypes.number,
    error: PropTypes.string,
    gatewayURL: PropTypes.string,
    isDownload: PropTypes.bool,
    doGetFileURL: PropTypes.func,
    doGetArchiveURL: PropTypes.func
  }

  state = {
    progress: 100
  }

  handleDownloadClick = async () => {
    const { cid, name, type, doGetFileURL, doGetArchiveURL } = this.props

    if (type === 'dir') {
      const { url, filename } = await doGetArchiveURL(cid)
      const updater = (progress) => this.setState({ progress: progress })
      return downloadArchive(url, filename, updater)
    }

    const { url, filename } = await doGetFileURL(name, cid)
    downloadFile(url, filename)
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
            value={progress}
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
    const { name, type, shareCID, error, t } = this.props
    const size = filesize(this.props.size || 0, { round: 0, spacer: '' })

    const fileNameClass = classnames({ charcoal: !error, gray: error }, ['FileLinkName ph2 f6 b truncate'])
    const fileSizeClass = classnames({ 'charcoal-muted': !error, gray: error }, ['f6'])

    const copyBtnClass = classnames({
      'o-50 no-pointer-events': this.state.copied,
      'o-80 glow pointer': !this.state.copied
    }, ['pa2 flex items-center justify-center br-pill bg-navy f7 white'])

    return (
      <div className='mv2 flex items-center justify-between'>
        <a
          title={t('box.viewOnGateway')}
          className='flex items-center link truncate FileLink'
          style={{ outline: 'none' }}
          href={`${ENDPOINTS.gateway}/${shareCID}/${encodeURI(name)}`}
          target='_blank'
          rel='noopener noreferrer'>
          <div>
            <FileIcon className="flex-shrink-0" name={name} type={type} error={error} />
          </div>
          <span className={fileNameClass}>{name}</span>
          <span className={fileSizeClass}>{size && `(~${size})`}</span>
        </a>
        <div className='flex'>
          <span className='ml-auto'>{ this.renderFileStatus() }</span>
          <CopyToClipboard text={`${ENDPOINTS.gateway}/${shareCID}/${encodeURI(name)}`} onCopy={this.handleOnCopyClick}>
            <div className={copyBtnClass}>
              { this.state.copied ? t('copyLink.copied') : t('copyLink.copy') }
            </div>
          </CopyToClipboard>
        </div>
      </div>
    )
  }

  handleOnCopyClick = () => {
    this.setState(
      { copied: true },
      () => setTimeout(() => this.setState({ copied: false }), 2500)
    )
  }
}

export const TranslatedFile = withTranslation('translation')(File)

export default connect(
  'selectMaxFileSize',
  'selectShareCID',
  'doGetFileURL',
  'doGetArchiveURL',
  TranslatedFile
)
