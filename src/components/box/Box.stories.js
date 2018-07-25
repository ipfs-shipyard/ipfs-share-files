import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import Box from './Box'

storiesOf('Box', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='bg-navy'>
      <Box />
    </div>
  ))
