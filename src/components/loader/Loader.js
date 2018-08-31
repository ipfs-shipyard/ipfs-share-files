import React from 'react'
import LoaderSpinner from 'react-loader-spinner'
import './Loader.css'

const Loader = ({
  loader = 'Puff',
  color = '#022e44',
  size = 25,
  text = 'Loading file list...'
}) => (
  <div className='Loader mv4 flex items-center'>
    <LoaderSpinner type={loader} color={color} height={size} width={size} />
    <span className='ml2 navy f6'>{text}</span>
  </div>
)

export default Loader
