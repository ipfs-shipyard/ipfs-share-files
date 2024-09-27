import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { App } from './App'
import i18n from './i18n'
import { FilesProvider } from './providers/FilesProvider'
import { HeliaProvider } from './providers/HeliaProvider'
import { DownloadProvider } from './providers/download-provider'
import registerServiceWorker from './registerServiceWorker'

// ReactDOM.render(
//     <DndProvider backend={HTML5Backend}>
//       <I18nextProvider i18n={i18n} >
//         <HeliaProvider>
//           <FilesProvider>
//             <DownloadProvider>
//               <App />
//             </DownloadProvider>
//           </FilesProvider>
//         </HeliaProvider>
//       </I18nextProvider>
//     </DndProvider>, document.getElementById('root'))

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
