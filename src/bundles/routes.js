import { createRouteBundle, createSelector } from 'redux-bundler'

// Constants
import PAGES from '../constants/pages'

// Pages
import Upload from '../pages/upload/Upload'
import Download from '../pages/download/Download'

const bundle = createRouteBundle({
  '/:hash': Download,
  '/add/:hash': Download,
  '*': Download
}, { routeInfoSelector: 'selectHash' })

bundle.selectCurrentPage = createSelector(
  'selectRouteInfo',
  ({ url, params }) => (url.startsWith('/add') || !params.hash) ? PAGES.upload : PAGES.download
)

export default bundle
