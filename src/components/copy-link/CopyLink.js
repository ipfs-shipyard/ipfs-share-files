import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classnames from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
    }, ['pa2 w-20 flex items-center justify-center br-pill bg-navy f7 white'])

    return (
      <div className='mb4'>
        { this.props.withLabel && <div className='f7 gray'>{t('copyLink.label')}</div> }
        <div className='pa1 mt3 w-100 flex items-center br-pill bg-light-gray'>
          <div className='ph2 w-80 f7 navy truncate'>
            { shareLink }
          </div>
          <CopyToClipboard text={shareLink} onCopy={this.handleOnCopyClick}>
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
      {copied: true},
      () => setTimeout(() => this.setState({copied: false}), 2500)
    )
  }
}

export default translate()(CopyLink)
