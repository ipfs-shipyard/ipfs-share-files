import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { cid } from 'is-ipfs'

// Constants
import PAGES from '../constants/pages'

// Components
import { BoxAdd, BoxDownload, BoxNotAvailable } from '../components/box/Box'
import Headline from '../components/headline/Headline'
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
      cid(currentHash) ? doFetchFileTree(currentHash) : doUpdateHash('#/')
      // doFetchFileTree(currentHash)
    }
  }

  render () {
    const { currentPage, ipfsInitFailed, shareLink, files, hasExceededMaxSize, isLoading, t } = this.props
    const isDownload = currentPage === PAGES.download
    let headline
    let content
    let info

    if (isDownload) {
      content = <BoxDownload files={files} showSizeWarning={hasExceededMaxSize} isLoading={isLoading} />
      headline = <Headline isDownload />
      info = <Info isDownload />
    } else if (ipfsInitFailed) {
      content = <BoxNotAvailable />
      headline = isDownload ? <Headline isDownload /> : <Headline />
      info = isDownload ? <Info isDownload /> : <Info />
    } else {
      content = <BoxAdd files={files} shareLink={shareLink} isLoading={isLoading} />
      headline = <Headline />
      info = <Info />
    }

    return (
      <div data-id='Page'>
        <Helmet>
          <title>{t('pageTitle.ipfs')} | { isDownload ? t('pageTitle.download') : t('pageTitle.add') }</title>
        </Helmet>
        { headline }

        <div className='flex flex-column flex-row-l items-start'>
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
  withTranslation('translation')(Page)
)
