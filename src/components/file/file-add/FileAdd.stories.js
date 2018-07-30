import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import FileAdd from './FileAdd'

storiesOf('FileAdd', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <FileAdd />
    </div>
  ))
