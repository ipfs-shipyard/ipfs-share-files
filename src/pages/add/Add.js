import React from 'react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'
import Info from '../../components/info/Info'

const Add = () => (
  <div data-id='Add'>
    <Helmet>
      <title>IPFS - Add Files</title>
    </Helmet>

    <div className='flex flex-column flex-row-l justify-center items-center'>
      <Box />
      <Info />
    </div>
  </div>
)

export default Add
