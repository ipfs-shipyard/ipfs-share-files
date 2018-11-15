import { composeBundles } from 'redux-bundler'
import ipfsBundle from 'ipfs-redux-bundle'
import appIdle from './app-idle'
import routesBundle from './routes'
import redirectsBundle from './redirects'
import filesBundle from './files'

export default composeBundles(
  appIdle({idleTimeout: 5000}),
  ipfsBundle({
    tryJsIpfs: true,
    getJsIpfs: () => import('ipfs')
  }),
  routesBundle,
  redirectsBundle,
  filesBundle
)
