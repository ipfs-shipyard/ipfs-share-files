import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation, Trans } from 'react-i18next'

import Modal from '../modal/Modal'

class Info extends React.Component {
  // Modals created by links
  constructor () {
    super()
    this.state = {
      showModalReprovide: false,
      showModalPrivacy: false,
      showModalHow: false,
      showModalCid: false
    }

    this.handleOpenModalHow = this.handleOpenModalHow.bind(this)
    this.handleCloseModalHow = this.handleCloseModalHow.bind(this)
    this.handleOpenModalCid = this.handleOpenModalCid.bind(this)
    this.handleCloseModalCid = this.handleCloseModalCid.bind(this)
    this.handleOpenModalReprovide = this.handleOpenModalReprovide.bind(this)
    this.handleCloseModalReprovide = this.handleCloseModalReprovide.bind(this)
    this.handleOpenModalPrivacy = this.handleOpenModalPrivacy.bind(this)
    this.handleCloseModalPrivacy = this.handleCloseModalPrivacy.bind(this)
  }

  handleOpenModalHow () {
    this.setState({ showModalHow: true })
  }

  handleCloseModalHow () {
    this.setState({ showModalHow: false })
  }

  handleOpenModalCid () {
    this.setState({ showModalCid: true })
  }

  handleCloseModalCid () {
    this.setState({ showModalCid: false })
  }

  handleCloseModalReprovide () {
    this.setState({ showModalReprovide: false })
  }

  handleOpenModalReprovide () {
    this.setState({ showModalReprovide: true })
  }

  handleOpenModalPrivacy () {
    this.setState({ showModalPrivacy: true })
  }

  handleCloseModalPrivacy () {
    this.setState({ showModalPrivacy: false })
  }

  render () {
    // imgHeight = 70 was unused
    const { t, isDownload, ipfsProvider } = this.props
    // Classes and styles
    const iconContainerClass = 'mr3 fill-aqua'
    const labelClass = 'f4 fw1 mb2 ml1 white montserrat'
    const descriptionClass = 'f6 ml1 gray-muted lh-copy'
    const anchorClass = 'no-underline underline-hover aqua bg-transparent pointer bn pa0'
    const anchorStyle = { outline: 'none' }
    // Links
    const howLink = <button className={anchorClass} style={anchorStyle} onClick={() => this.handleOpenModalHow(true)}>{t('info.learnMore')}</button>
    const cidLink = <button className={anchorClass} style={anchorStyle} onClick={() => this.handleOpenModalCid(true)}>{t('info.learnMore')}</button>
    const reprovideLink = <button className={anchorClass} style={anchorStyle} onClick={() => this.handleOpenModalReprovide(true)}>{t('info.learnMore')}</button>
    const privacyLink = <button className={anchorClass} style={anchorStyle} onClick={() => this.handleOpenModalPrivacy(true)}>{t('info.learnMore')}</button>

    const isUsingDaemon = ipfsProvider === 'js-ipfs-api'

    // Info for the Download page
    if (isDownload) {
      return (
        <div>
          <div className='pr5-l w-100 w-two-thirds-l mw7-l'>
            <div className='mv4 mv2-l flex flex-column'>
              <div className='flex items-center'>
                <div className={iconContainerClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M55.44 24.71a4.76 4.76 0 01-5.07 4.9 4.69 4.69 0 01-4.81-4.9 4.86 4.86 0 015-5 4.79 4.79 0 014.88 5zm-8.89 56.23V37h8v43.9z"/></svg>
                </div>
                <div>
                  <div className={labelClass}>
                    {t('info.download.labelHow')}
                  </div>
                  <div className={descriptionClass}>
                    {t('info.download.copyHow')} {howLink}
                  </div>
                </div>
              </div>

              <div className='mt4 pt2 flex items-center'>
                <div className={iconContainerClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M65.69 55.44a9.37 9.37 0 00-7.86 4.26l-17.29-8a9 9 0 000-3.38l17.29-8a9.38 9.38 0 10-1.53-5.13v.68l-17.72 8.2a9.39 9.39 0 100 11.87l17.75 8.21v.68a9.39 9.39 0 109.39-9.39z"/></svg>
                </div>
                <div>
                <div className={labelClass}>
                    {t('info.download.labelKeep')}
                  </div>
                  <div className={descriptionClass}>
                    {isUsingDaemon ? t('info.download.copyKeepDaemon') : t('info.download.copyKeepPage')} {reprovideLink}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal // controlled by howLink
              isOpen={this.state.showModalHow}
              onClose={this.handleCloseModalHow}
              title={t('modal.how.title')}
              contentLabel={t('modal.how.ariaLabel')}
          >
              <p>{t('modal.how.copy')}</p>
              <p><Trans i18nKey='modal.how.learnMore'>
                Learn more about IPFS and how it's changing the internet by visiting the <a className='no-underline underline-hover teal' href='https://ipfs.io' target='_blank' rel='noopener noreferrer'>IPFS website</a>.
              </Trans></p>
          </Modal>
          <Modal // controlled by reprovideLink
              isOpen={this.state.showModalReprovide}
              onClose={this.handleCloseModalReprovide}
              title={t('modal.reprovide.title')}
              contentLabel={t('modal.reprovide.ariaLabel')}
          >
              <p>{t('modal.reprovide.copy')}</p>
              <p><Trans i18nKey='modal.reprovide.learnMore'>
              Curious how this works under the hood? Check out the <a className='no-underline underline-hover teal' href='https://docs.ipfs.io' target='_blank' rel='noopener noreferrer'>official IPFS documentation</a> for everything from basic explainers to developer tools.
              </Trans></p>
          </Modal>
        </div>
      )
    }

    // Info for the Add page
    return (
      <div>
        <div className='pr5-l w-100 w-two-thirds-l mw7-l'>
          <div className='mv4 mv2-l flex flex-column'>
            <div className='flex items-center'>
              <div className={iconContainerClass}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M48.78 79.59V31H37.59v-8.59h20.82v57.18z"/><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /></svg>
              </div>
              <div>
                <div className={labelClass}>
                  {t('info.add.labelAdd')}
                </div>
                <div className={descriptionClass}>
                  {t('info.add.copyAdd')} {privacyLink}
                </div>
              </div>
            </div>

            <div className='mv4 pv2 flex items-center'>
              <div className={iconContainerClass}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M68.64 34.43c0 5.8-4.41 12.26-10.45 18.79L43.32 69h27.94v8.65H30.58v-7L51.65 48c4.17-4.24 7-8.9 7-12.17 0-4.57-3.6-7.35-9.56-7.35-5 0-10.78 2.78-15.6 7.19l-3.89-7.44c6.21-5.07 13.48-8.17 20.83-8.17 10.78 0 18.21 5.63 18.21 14.37z"/></svg>          </div>
              <div>
                <div className={labelClass}>
                  {isUsingDaemon ? t('info.add.labelKeepDaemon') : t('info.add.labelKeepPage')}
                </div>
                <div className={descriptionClass}>
                  {isUsingDaemon ? t('info.add.copyKeepDaemon') : t('info.add.copyKeepPage')}
                </div>
              </div>
            </div>
            <div className='flex items-center'>
              <div className={iconContainerClass}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 100 100"><path d="M50 4A46 46 0 114 50 46.06 46.06 0 0150 4m0-4a50 50 0 1050 50A50 50 0 0050 0z" /><path d="M54.81 47.14c9.56.86 16.09 6.37 16.09 15.35 0 10.71-8.08 18.14-20.82 18.14a33.08 33.08 0 01-19.28-6.21l4-7.84a21.58 21.58 0 0014.62 6c7.6 0 12-3.92 12-9.8 0-6.21-4.49-9.39-12.09-9.39h-7.91v-5.68l14.86-16H33.41v-8.59h34.8v6.05L51.87 46.81z"/></svg>          </div>
              <div>
                <div className={labelClass}>
                  {t('info.add.labelSend')}
                </div>
                <div className={descriptionClass}>
                  {t('info.add.copySend')} {cidLink}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal // controlled by privacyLink
              isOpen={this.state.showModalPrivacy}
              onClose={this.handleCloseModalPrivacy}
              title={t('modal.privacy.title')}
              contentLabel={t('modal.privacy.ariaLabel')}
          >
              <p>{t('modal.privacy.copy')}</p>
              <p><Trans i18nKey='modal.privacy.learnMore'>
                Learn more in the <a className='no-underline underline-hover teal' href='https://docs.ipfs.io' target='_blank' rel='noopener noreferrer'>official IPFS documentation</a>.
              </Trans></p>
          </Modal>
          <Modal // controlled by cidLink
              isOpen={this.state.showModalCid}
              onClose={this.handleCloseModalCid}
              title={t('modal.cid.title')}
              contentLabel={t('modal.cid.ariaLabel')}
          >
              <p>{t('modal.cid.copy')}</p>
              <p><Trans i18nKey='modal.cid.learnMore'>
                Learn more in the <a className='no-underline underline-hover teal' href='https://docs.ipfs.io' target='_blank' rel='noopener noreferrer'>official IPFS documentation</a>.
              </Trans></p>
          </Modal>
        </div>
      </div>
    )
  }
}

export const TranslatedInfo = withTranslation('translation')(Info)

export default connect(
  'selectIpfsProvider',
  TranslatedInfo
)
