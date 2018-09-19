import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-bundler-react'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import getStore from './bundles'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

ReactDOM.render(
  <Provider store={getStore()}>
    <I18nextProvider i18n={i18n} >
      <App />
    </I18nextProvider>
  </Provider>, document.getElementById('root'))

registerServiceWorker()
