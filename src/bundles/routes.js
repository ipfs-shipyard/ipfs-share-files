import { createRouteBundle, createSelector } from 'redux-bundler'
// import PAGES from '../constants/pages'
import Page from '../page/Page'


const bundle = createRouteBundle({
  '/:hash': Page,
  '/add/:hash': Page,
  '*': Page
}, { routeInfoSelector: 'selectHash' })

bundle.selectCurrentPage = createSelector(
  'selectRouteInfo',
  ({ url, params }) => (url.startsWith('/add') || !params.hash) ? 'add' : 'download'
)

bundle.selectFilename = createSelector(
  'selectRouteInfo',
  ({ url }) => {
    const newUrl = new URL(url, 'http://example.com')
    const filename = newUrl.searchParams.get('filename')

    return filename
  }
)

export default bundle
