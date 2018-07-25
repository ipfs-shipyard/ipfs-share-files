import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import navHelper from 'internal-nav-helper'

// Components
import Header from './components/header/Header'
import Footer from './components/footer/Footer'

export class App extends Component {
  static propTypes = {
    doInitIpfs: PropTypes.func.isRequired,
    doUpdateUrl: PropTypes.func.isRequired,
    route: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]).isRequired
  }

  componentWillMount () {
    this.props.doInitIpfs()
  }

  render () {
    const Page = this.props.route

    return (
      <div className='App sans-serif' onClick={navHelper(this.props.doUpdateUrl)}>
        <div className='flex flex-column min-vh-100'>
          <Header />
          <main className='flex-auto pa4'>
            <Page />
          </main>
          <Footer />
        </div>
      </div>
    )
  }
}

export default connect(
  'selectRoute',
  'doUpdateUrl',
  'doInitIpfs',
  App
)
