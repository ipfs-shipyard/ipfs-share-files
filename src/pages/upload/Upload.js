import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'

// Constants
import PAGES from '../../constants/pages'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

class Upload extends React.Component {
  static propTypes = {
    currentPage: PropTypes.string.isRequired,
    routeInfo: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    files: PropTypes.object,
    shareLink: PropTypes.string,
    doFetchFileTree: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { currentPage, routeInfo: { params }, doFetchFileTree } = this.props

    if (currentPage === PAGES.upload && params.hash) {
      doFetchFileTree(params.hash)
    }
  }

  render () {
    const { files, shareLink, isLoading } = this.props

    return (
      <div data-id='Upload'>
        <Helmet>
          <title>IPFS - Upload Files</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          <Box files={files} shareLink={shareLink} isLoading={isLoading} />
          <Info />
        </div>
      </div>
    )
  }
}

export default connect(
  'selectCurrentPage',
  'selectRouteInfo',
  'selectIsLoading',
  'selectFiles',
  'selectShareLink',
  'doFetchFileTree',
  Upload
)
