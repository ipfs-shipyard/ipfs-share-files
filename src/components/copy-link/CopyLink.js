import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import classnames from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'

class CopyLink extends React.Component {
  static propTypes = {
    shareLink: PropTypes.string.isRequired,
    withLabel: PropTypes.bool.isRequired
  }

  static defaultProps = {
    shareLink: '',
    withLabel: true
  }

  state = {
    copied: false
  }

  render () {
    const { shareLink, t } = this.props
    const copyBtnClass = classnames({
      'o-50 no-pointer-events': this.state.copied,
      'o-80 glow pointer': !this.state.copied
    }, ['pa2 w3 flex items-center justify-center br-pill bg-navy f7 white'])

    return (
      <div>
        { this.props.withLabel && <div className='f5 montserrat fw4 charcoal mt4 mb1'>{t('copyLink.labelAll')}</div> }
        <div className='f7 charcoal-muted lh-copy'>
          {t('copyLink.footNote')}
        </div>
        <div className='pa1 mt2 mb4 w-100 flex items-center justify-between br-pill bg-light-gray'>
          <div className='ph2 w-80 f7 navy truncate'>
            { shareLink }
          </div>
          <CopyToClipboard text={shareLink} onCopy={this.handleOnCopyClick}>
            <div className={copyBtnClass}>
              { this.state.copied ? t('copyLink.copied') : t('copyLink.copy') }
            </div>
          </CopyToClipboard>
        </div>
        <div className="flex justify-center">
          <QRCode value={shareLink}/>
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

export default withTranslation('translation')(CopyLink)
