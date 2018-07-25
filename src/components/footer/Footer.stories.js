import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import Footer from './Footer'

storiesOf('Footer', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='bg-navy'>
      <Footer />
    </div>
  ))
