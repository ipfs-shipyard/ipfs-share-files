import ReactDOM from 'react-dom'
import { App } from './App'
import registerServiceWorker from './registerServiceWorker'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { HeliaProvider } from './providers/HeliaProvider'
import { FilesProvider } from './providers/FilesProvider'

ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
      <I18nextProvider i18n={i18n} >
        <HeliaProvider>
          <FilesProvider>
            <App />
          </FilesProvider>
        </HeliaProvider>
      </I18nextProvider>
    </DndProvider>, document.getElementById('root'))

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
