import { createRouteBundle } from 'redux-bundler'

// Pages
import Upload from '../pages/upload/Upload'
import Download from '../pages/download/Download'

export default createRouteBundle({
  '': Upload,
  '/': Upload,
  '/add/:hash': Upload,
  '/:hash': Download
}, { routeInfoSelector: 'selectHash' })
