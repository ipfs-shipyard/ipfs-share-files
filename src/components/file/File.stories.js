import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import File from './File'

storiesOf('File', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <File
        hash='Qm3fsA'
        name='game-of-thrones.mkv'
        size='265318832' />
    </div>
  ))
  .add('Uploading', () => (
    <div className='ma3'>
      <File
        hash='Qm3fsA'
        name='game-of-thrones.mkv'
        size='265318832'
        progress={70} />
    </div>
  ))
  .add('Uploaded', () => (
    <div className='ma3'>
      <File
        hash='Qm3fsA'
        name='game-of-thrones.mkv'
        size='265318832'
        progress={100} />
    </div>
  ))
  .add('Errored', () => (
    <div className='ma3'>
      <File
        hash='Qm3fsA'
        name='game-of-thrones.mkv'
        size='265318832'
        progress={100}
        error={'error'} />
    </div>
  ))
  .add('Folder', () => (
    <div className='ma3'>
      <File
        hash='Qm3fsA'
        name='game-of-thrones'
        type='directory' />
    </div>
  ))
