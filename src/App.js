import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import navHelper from 'internal-nav-helper'

// Components
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

// Styles
import './App.css'

export class App extends Component {
  static propTypes = {
    doInitIpfs: PropTypes.func.isRequired,
    doUpdateUrl: PropTypes.func.isRequired,
    route: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]).isRequired,
    ipfsReady: PropTypes.bool.isRequired,
    ipfsInitFailed: PropTypes.bool.isRequired
  }

  componentWillMount () {
    this.props.doInitIpfs()
  }

  render () {
    const { route: Page, ipfsReady, ipfsInitFailed } = this.props
    // Only shows the page if IPFS is ready or if the initialization has failed.
    // This way we can make sure we always use user's own node if available and
    // the public gateway otherwise.
    const ready = ipfsReady || ipfsInitFailed

    return (
      <div className='App sans-serif' onClick={navHelper(this.props.doUpdateUrl)}>
        <div className='flex flex-column min-vh-100'>
          <Header />
          <main className='flex-auto pa4'>
            { ready && <Page /> }
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}

export default connect(
  'selectRoute',
  'selectIpfsReady',
  'selectIpfsInitFailed',
  'doUpdateUrl',
  'doInitIpfs',
  App
)
