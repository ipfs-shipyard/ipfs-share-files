import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'
import React from 'react'
import i18n from '../../i18n-decorator'
import { Info } from './Info'

storiesOf('Info', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('Add', () => (
    <div className='bg-navy sans-serif'>
      <Info />
    </div>
  ))
  .add('Download', () => (
    <div className='bg-navy sans-serif'>
      <Info isDownload />
    </div>
  ))
