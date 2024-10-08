import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'
import React from 'react'
import i18n from '../../i18n-decorator.js'
import Loader from './loader.js'

storiesOf('Loader', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('Default', () => (
    <div className='ml4 sans-serif'>
      <Loader />
    </div>
  ))
