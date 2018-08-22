import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import AddFiles from './AddFiles'

storiesOf('AddFiles', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <AddFiles />
    </div>
  ))
