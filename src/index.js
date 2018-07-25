import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import { Provider } from 'redux-bundler-react'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import getStore from './bundles'
import './index.css'

ReactDOM.render(
  <Provider store={getStore()}>
    <IntlProvider locale='en'>
      <App />
    </IntlProvider>
  </Provider>, document.getElementById('root'))

registerServiceWorker()
