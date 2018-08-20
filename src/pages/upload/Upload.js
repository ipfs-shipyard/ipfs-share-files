import React from 'react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

const Upload = () => (
  <div data-id='Upload'>
    <Helmet>
      <title>IPFS - Upload Files</title>
    </Helmet>

    <div className='flex flex-column flex-row-l justify-center items-center'>
      <Box />
      <Info />
    </div>
  </div>
)

export default Upload
