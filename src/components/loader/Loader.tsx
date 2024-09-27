import React from 'react'
import { useTranslation } from 'react-i18next'
import { Puff } from 'react-loader-spinner'
import './Loader.css'

export interface LoaderProps {
  // TODO: support different loader types
  // loader?: RlsLoaderProps['type']
  color?: string
  size?: number
  text?: string
}

const Loader = ({
  // loader = 'Puff',
  color = '#022e44',
  size = 25
}: LoaderProps): React.JSX.Element => {
  const { t } = useTranslation('translation')
  const text = t('loader')
  return (
    <div className='Loader mv2 flex items-center'>
      <Puff color={color} height={size} width={size} />
      <span className='ml2 navy f6'>{text}</span>
    </div>
  )
}

export default Loader
