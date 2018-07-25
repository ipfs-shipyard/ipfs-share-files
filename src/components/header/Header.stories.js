import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import Header from './Header'

storiesOf('Header', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='bg-navy'>
      <Header />
    </div>
  ))
