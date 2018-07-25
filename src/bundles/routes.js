import { createRouteBundle } from 'redux-bundler'
import Home from '../pages/home/Home'

export default createRouteBundle({
  '/': Home,
  '': Home
}, { routeInfoSelector: 'selectHash' })
