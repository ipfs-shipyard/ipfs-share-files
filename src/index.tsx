import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { App } from './app'
import i18n from './i18n'
import { DownloadProvider } from './providers/download-provider'
import { FilesProvider } from './providers/files-provider'
import { HeliaProvider } from './providers/helia-provider'
import registerServiceWorker from './register-service-worker'

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
