import { composeBundles, createUrlBundle } from 'redux-bundler'
import ipfsProvider from './ipfs-provider'
import appIdle from './app-idle'
import routesBundle from './routes'
import redirectsBundle from './redirects'
import filesBundle from './files'

const urlBundle = createUrlBundle

export default composeBundles(
  appIdle({ idleTimeout: 5000 }),
  ipfsProvider,
  routesBundle,
  redirectsBundle,
  filesBundle
)
