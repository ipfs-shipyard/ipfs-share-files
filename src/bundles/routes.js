import { createRouteBundle, createSelector } from 'redux-bundler'
import PAGES from '../constants/pages'
import Page from '../page/Page'

const bundle = createRouteBundle({
  '/:hash': Page,
  '/add/:hash': Page,
  '*': Page
}, { routeInfoSelector: 'selectHash' })

bundle.selectCurrentPage = createSelector(
  'selectRouteInfo',
  ({ url, params }) => (url.startsWith('/add') || !params.hash) ? PAGES.add : PAGES.download
)

export default bundle
