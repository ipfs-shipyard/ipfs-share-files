import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'
import React from 'react'
import i18n from '../../i18n-decorator'
import Footer from './Footer'

storiesOf('Footer', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('Default', () => (
    <div className='bg-navy sans-serif'>
      <Footer />
    </div>
  ))
