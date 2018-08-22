import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'

// Components
import AddFiles from '../add-files/AddFiles'
import FileTree from '../file-tree/FileTree'
import CopyLink from '../copy-link//CopyLink'

const Footnote = () => (
  <div className='f7 gray lh-copy'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </div>
)

class Box extends React.Component {
  static propTypes = {
    routeInfo: PropTypes.object.isRequired,
    files: PropTypes.object.isRequired,
    shareLink: PropTypes.string,
    doAddFiles: PropTypes.func.isRequired,
    doFetchFileTree: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { url, params } = this.props.routeInfo

    if (url.startsWith('/add')) {
      this.props.doFetchFileTree(params.hash)
    }
  }

  render () {
    const { doAddFiles, files, shareLink } = this.props

    return (
      <div className='mb4 mb0-l pa4 w-100 w-third-l mw6 order-2-l br3 shadow-4 bg-white'>
        <AddFiles doAddFiles={doAddFiles} />
        <FileTree files={files} />
        { shareLink && <CopyLink shareLink={shareLink} /> }
        <Footnote />
      </div>
    )
  }
}

export default connect(
  'selectRouteInfo',
  'doFetchFileTree',
  'selectFiles',
  'selectShareLink',
  'doAddFiles',
  Box
)
