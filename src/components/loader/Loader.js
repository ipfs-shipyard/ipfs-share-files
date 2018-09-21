import React from 'react'
import { translate } from 'react-i18next'
import LoaderSpinner from 'react-loader-spinner'
import './Loader.css'

const Loader = ({
  t,
  loader = 'Puff',
  color = '#022e44',
  size = 25,
  text = t('loader')
}) => (
  <div className='Loader mv2 flex items-center'>
    <LoaderSpinner type={loader} color={color} height={size} width={size} />
    <span className='ml2 navy f6'>{text}</span>
  </div>
)

export default translate()(Loader)
