import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

class Upload extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    ipfsReady: PropTypes.bool.isRequired,
    files: PropTypes.object,
    shareLink: PropTypes.string,
    doFetchFileTree: PropTypes.func.isRequired
  }

  componentDidUpdate (prevProps) {
    const { routeInfo: { url, params }, ipfsReady, doFetchFileTree } = this.props

    if (url.startsWith('/add') && !prevProps.ipfsReady && ipfsReady) {
      doFetchFileTree(params.hash)
    }
  }

  render () {
    const { files, shareLink } = this.props

    return (
      <div data-id='Upload'>
        <Helmet>
          <title>IPFS - Upload Files</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          <Box files={files} shareLink={shareLink} />
          <Info />
        </div>
      </div>
    )
  }
}

export default connect(
  'selectRouteInfo',
  'selectIpfsReady',
  'selectFiles',
  'selectShareLink',
  'doFetchFileTree',
  Upload
)
