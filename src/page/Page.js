import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { translate } from 'react-i18next'
import { Helmet } from 'react-helmet'
import isIPFS from 'is-ipfs'

// Constants
import PAGES from '../constants/pages'

// Components
import { BoxAdd, BoxDownload, BoxNotAvailable } from '../components/box/Box'
import Info from '../components/info/Info'

class Page extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    files: PropTypes.object.isRequired,
    doFetchFileTree: PropTypes.func.isRequired,
    doResetFiles: PropTypes.func.isRequired,
    doUpdateHash: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired,
    ipfsInitFailed: PropTypes.bool.isRequired,
    shareLink: PropTypes.string
  }

  componentDidUpdate (prevProps) {
    this.handleRouting(prevProps)
  }

  componentDidMount () {
    this.handleRouting()
  }

  handleRouting (prevProps) {
    const { doUpdateHash, doFetchFileTree, doResetFiles } = this.props
    const prevHash = prevProps && prevProps.routeInfo.params.hash
    const currentHash = this.props.routeInfo.params.hash

    if (prevHash !== currentHash) {
      doResetFiles()
      isIPFS.cid(currentHash) ? doFetchFileTree(currentHash) : doUpdateHash('#/')
    }
  }

  render () {
    const { currentPage, ipfsInitFailed, shareLink, files, hasExceededMaxSize, isLoading, t } = this.props
    const isDownload = currentPage === PAGES.download
    let content
    let info

    if (isDownload) {
      content = <BoxDownload files={files} showSizeWarning={hasExceededMaxSize} isLoading={isLoading} />
      info = <Info isDownload />
    } else if (ipfsInitFailed) {
      content = <BoxNotAvailable />
      info = isDownload ? <Info isDownload /> : <Info />
    } else {
      content = <BoxAdd files={files} shareLink={shareLink} isLoading={isLoading} />
      info = <Info />
    }

    return (
      <div data-id='Page'>
        <Helmet>
          <title>{t('pageTitle.ipfs')} - { isDownload ? t('pageTitle.download') : t('pageTitle.add') }</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          { content }
          { info }
        </div>
      </div>
    )
  }
}

export default connect(
  'doFetchFileTree',
  'doResetFiles',
  'doUpdateHash',
  'selectIpfsInitFailed',
  'selectRouteInfo',
  'selectIsLoading',
  'selectHasExceededMaxSize',
  'selectFiles',
  'selectCurrentPage',
  'selectShareLink',
  translate()(Page)
)
