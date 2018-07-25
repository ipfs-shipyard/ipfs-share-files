import { createRouteBundle } from 'redux-bundler'
import HomePage from '../home/HomePage'

export default createRouteBundle({
  '/': HomePage,
  '': HomePage
}, { routeInfoSelector: 'selectHash' })
