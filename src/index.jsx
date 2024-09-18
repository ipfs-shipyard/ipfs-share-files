import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-bundler-react'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import getStore from './bundles'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

ReactDOM.render(
  <Provider store={getStore()}>
    <DndProvider backend={HTML5Backend}>
      <I18nextProvider i18n={i18n} >
        <App />
      </I18nextProvider>
    </DndProvider>
  </Provider>, document.getElementById('root'))

registerServiceWorker()

/**
 *
 * import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

 */
