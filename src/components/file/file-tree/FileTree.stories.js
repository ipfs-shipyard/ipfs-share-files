import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import FileTree from './FileTree'

storiesOf('FileTree', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <FileTree />
    </div>
  ))
