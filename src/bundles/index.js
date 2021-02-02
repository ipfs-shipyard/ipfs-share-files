import { composeBundles } from 'redux-bundler'
import ipfsProvider from './ipfs-provider'
import appIdle from './app-idle'
import routesBundle from './routes'
import redirectsBundle from './redirects'
import filesBundle from './files'

export default composeBundles(
  appIdle({ idleTimeout: 5000 }),
  ipfsProvider,
  routesBundle,
  redirectsBundle,
  filesBundle
)
