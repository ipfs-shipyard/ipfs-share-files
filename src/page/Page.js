import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'
import isIPFS from 'is-ipfs'

// Constants
import PAGES from '../constants/pages'

// Components
import { BoxUpload, BoxDownload, BoxNotAvailable } from '../components/box/Box'
import Info from '../components/info/Info'

class Page extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    files: PropTypes.object.isRequired,
    doFetchFileTree: PropTypes.func.isRequired,
    doUpdateHash: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired,
    ipfsInitFailed: PropTypes.bool.isRequired,
    shareLink: PropTypes.string
  }

  update (prevProps) {
    const { doUpdateHash, routeInfo: { params }, doFetchFileTree } = this.props

    if (params.hash) {
      if (prevProps && prevProps.routeInfo.params.hash === params.hash) {
        return
      }

      if (!isIPFS.cid(params.hash)) {
        return doUpdateHash('#/')
      }

      doFetchFileTree(params.hash)
    }
  }

  componentDidMount () {
    this.update()
  }

  componentDidUpdate (prevProps) {
    this.update(prevProps)
  }

  render () {
    const { currentPage, ipfsInitFailed, shareLink, files, isLoading } = this.props
    const isDownload = currentPage === PAGES.download
    let content

    if (isDownload) {
      content = <BoxDownload files={files} shareLink={shareLink} isLoading={isLoading} />
    } else if (ipfsInitFailed) {
      content = <BoxNotAvailable />
    } else {
      content = <BoxUpload files={files} shareLink={shareLink} isLoading={isLoading} />
    }

    return (
      <div data-id='Download'>
        <Helmet>
          <title>IPFS - { isDownload ? 'Download' : 'Upload' } Files</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          { content }
          <Info />
        </div>
      </div>
    )
  }
}

export default connect(
  'doFetchFileTree',
  'doUpdateHash',
  'selectIpfsInitFailed',
  'selectRouteInfo',
  'selectIsLoading',
  'selectFiles',
  'selectCurrentPage',
  'selectShareLink',
  Page
)
