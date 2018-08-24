import React from 'react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

const Download = () => (
  <div data-id='Download'>
    <Helmet>
      <title>IPFS - Download Files</title>
    </Helmet>

    <div className='flex flex-column flex-row-l justify-center items-center'>
      <Box isDownload />
      <Info />
    </div>
  </div>
)

export default Download
