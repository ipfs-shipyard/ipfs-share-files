import { createRouteBundle } from 'redux-bundler'

// Pages
import Upload from '../pages/upload/Upload'
import Add from '../pages/add/Add'
import Download from '../pages/download/Download'

export default createRouteBundle({
  '': Upload,
  '/': Upload,
  '/add/:hash': Add,
  '/:hash': Download
}, { routeInfoSelector: 'selectHash' })
