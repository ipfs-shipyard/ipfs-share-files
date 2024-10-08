import React from 'react'
import Footer from './components/footer/footer.jsx'
import Header from './components/header/header.jsx'
import './app.css'
import { useHelia } from './hooks/use-helia.js'
import { Page } from './page/page.jsx'

export const App = (): React.JSX.Element => {
  const { starting, error } = useHelia()

  // Only shows the page if IPFS is ready or if the initialization has failed.
  const ready = !starting || error

  return (
    <div className='App sans-serif'>
      <div className='flex flex-column min-vh-100'>
        <Header />
        <main className='flex-auto ph4'>
          { ready && <Page /> }
        </main>
        <Footer />
      </div>
    </div>
  )
}
