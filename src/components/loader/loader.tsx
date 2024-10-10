import React from 'react'
import { useTranslation } from 'react-i18next'
import { Puff } from 'react-loader-spinner'
import './loader.css'

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
  size = 25,
  text = ''
}: LoaderProps): React.JSX.Element => {
  const { t } = useTranslation('translation')

  if (text === '') {
    text = t('loader.fileList')
  }

  return (
    <div className='Loader mv2 flex items-center'>
      <Puff color={color} height={size} width={size} />
      <span className='ml2 navy f6'>{text}</span>
    </div>
  )
}

export default Loader
