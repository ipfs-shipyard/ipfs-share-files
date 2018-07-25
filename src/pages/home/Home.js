import React from 'react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'

const Home = () => (
  <div data-id='Home'>
    <Helmet>
      <title>IPFS - Share Files</title>
    </Helmet>

    <div className='flex justify-end pa3'>
      <Box />
    </div>
  </div>
)

export default Home
