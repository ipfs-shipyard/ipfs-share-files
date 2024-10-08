import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { App } from './app.jsx'
import i18n from './i18n'
import { DownloadProvider } from './providers/download-provider.jsx'
import { FilesProvider } from './providers/files-provider.jsx'
import { HeliaProvider } from './providers/helia-provider.jsx'
import registerServiceWorker from './register-service-worker.js'

const rootEl = document.getElementById('root')
if (rootEl == null) {
  throw new Error('Root element not found')
}
const root = createRoot(rootEl)

root.render(
  <DndProvider backend={HTML5Backend}>
    <I18nextProvider i18n={i18n} >
      <HeliaProvider>
        <FilesProvider>
          <DownloadProvider>
            <App />
          </DownloadProvider>
        </FilesProvider>
      </HeliaProvider>
    </I18nextProvider>
  </DndProvider>
)

registerServiceWorker()
