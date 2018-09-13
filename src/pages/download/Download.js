import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

class Download extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    files: PropTypes.object.isRequired,
    doFetchFileTree: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { routeInfo: { params }, doFetchFileTree } = this.props

    doFetchFileTree(params.hash)
  }

  render () {
    const { files, isLoading } = this.props

    return (
      <div data-id='Download'>
        <Helmet>
          <title>IPFS - Download Files</title>
        </Helmet>

        <div className='flex flex-column flex-row-l justify-center items-center'>
          <Box files={files} isDownload isLoading={isLoading} />
          <Info />
        </div>
      </div>
    )
  }
}

export default connect(
  'selectRouteInfo',
  'selectIsLoading',
  'selectFiles',
  'doFetchFileTree',
  Download
)
