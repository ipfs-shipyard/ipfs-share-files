import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import FileIcon from './FileIcon'

storiesOf('FileIcon', module)
  .addDecorator(checkA11y)
  .add('All', () => (
    <div className='ma3'>
      <FileIcon />
      <FileIcon type='audio' />
      <FileIcon type='video' />
      <FileIcon type='image' />
      <FileIcon type='text' />
      <FileIcon type='cacl' />
      <FileIcon type='directory' />
    </div>
  ))
  .add('Default', () => (
    <div className='ma3'>
      <FileIcon />
    </div>
  ))
  .add('Audio', () => (
    <div className='ma3'>
      <FileIcon type='audio' />
    </div>
  ))
  .add('Video', () => (
    <div className='ma3'>
      <FileIcon type='video' />
    </div>
  ))
  .add('Image', () => (
    <div className='ma3'>
      <FileIcon type='image' />
    </div>
  ))
  .add('Text', () => (
    <div className='ma3'>
      <FileIcon type='text' />
    </div>
  ))
  .add('Calc', () => (
    <div className='ma3'>
      <FileIcon type='calc' />
    </div>
  ))
  .add('Folder', () => (
    <div className='ma3'>
      <FileIcon type='directory' />
    </div>
  ))
