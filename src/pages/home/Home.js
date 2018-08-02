import React from 'react'
import { Helmet } from 'react-helmet'

// Components
import Box from '../../components/box/Box'

// Static
import uploadImg from '../../media/images/upload.svg'

const HowItWorks = () => {
  const imgHeigth = 110

  return (
    <div className='pa4 pr5-l w-100 w-two-thirds-l mw7 order-1-l'>
      <div className='mb4 f2 b white'>How it works?</div>
      <div className='mb5 f5 gray lh-copy'>
        Vulputate enim nulla aliquet porttitor lacus.
        Id interdum velit laoreet id donec ultrices tincidunt.
        Orci dapibus ultrices in iaculis. In massa tempor nec feugiat nisl pretium fusce.
        Libero id faucibus nisl tincidunt eget nullam non nisi. Suscipit tellus mauris a diam maecenas.
      </div>
      <div className='flex'>
        <div className='pa3 tc'>
          <img src={uploadImg} height={imgHeigth} alt='Upload' />
          <div className='mv2 f6 b white'>Upload file to IPFS</div>
          <div className='f6 gray lh-copy'>Donec sed odio dui. Crusto odio, dapibus ac facilis in, egestas eget quam.</div>
        </div>

        <div className='pa3 tc'>
          <img src={uploadImg} height={imgHeigth} alt='Upload' />
          <div className='mv2 f6 b white'>Upload file to IPFS</div>
          <div className='f6 gray lh-copy'>Donec sed odio dui. Crusto odio, dapibus ac facilis in, egestas eget quam.</div>
        </div>

        <div className='pa3 tc'>
          <img src={uploadImg} height={imgHeigth} alt='Upload' />
          <div className='mv2 f6 b white'>Upload file to IPFS</div>
          <div className='f6 gray lh-copy'>Donec sed odio dui. Crusto odio, dapibus ac facilis in, egestas eget quam.</div>
        </div>
      </div>
    </div>
  )
}

const Home = () => (
  <div data-id='Home'>
    <Helmet>
      <title>IPFS - Share Files</title>
    </Helmet>

    <div className='flex flex-column flex-row-l justify-center items-center'>
      <Box />
      <HowItWorks />
    </div>
  </div>
)

export default Home
