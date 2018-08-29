import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import { DownloadFiles } from './DownloadFiles'

storiesOf('DownloadFiles', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <DownloadFiles />
    </div>
  ))
