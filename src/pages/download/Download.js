import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'
import isIPFS from 'is-ipfs'

// Constants
import PAGES from '../../constants/pages'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

// TODO: re-render every URL change
class Download extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    files: PropTypes.object.isRequired,
    doFetchFileTree: PropTypes.func.isRequired,
    doUpdateHash: PropTypes.func.isRequired,
    currentPage: PropTypes.string.isRequired,
    shareLink: PropTypes.string
  }

  componentDidMount () {
    const { doUpdateHash, routeInfo: { params }, doFetchFileTree } = this.props

    if (params.hash) {
      if (!isIPFS.cid(params.hash)) {
        return doUpdateHash('#/')
      }

      doFetchFileTree(params.hash)
    }
  }

  render () {
    const { currentPage, files, isLoading } = this.props
    const isDownload = currentPage === PAGES.download

    return (
      <div data-id='Download'>
        <Helmet>
          <title>IPFS - { isDownload ? 'Download' : 'Upload' } Files</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          <Box files={files} isDownload={isDownload} isLoading={isLoading} />
          <Info />
        </div>
      </div>
    )
  }
}

export default connect(
  'doFetchFileTree',
  'doUpdateHash',
  'selectRouteInfo',
  'selectIsLoading',
  'selectFiles',
  'selectCurrentPage',
  'selectShareLink',
  Download
)
