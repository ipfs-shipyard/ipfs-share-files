import { composeBundles } from 'redux-bundler'
import ipfsBundle from 'ipfs-redux-bundle'
import appIdle from './app-idle'
import routesBundle from './routes'
import redirectsBundle from './redirects'

export default composeBundles(
  appIdle({idleTimeout: 5000}),
  ipfsBundle,
  routesBundle,
  redirectsBundle
)
