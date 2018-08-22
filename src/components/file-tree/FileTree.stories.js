import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import FileTree from './FileTree'

const files = [
  { name: 'game-of-thrones.avi', size: 989827344, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 30 },
  { name: 'chill-out.mp3', size: 5423424, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 60 },
  { name: 'fate.txt', size: 4254384, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 100 }
]

storiesOf('FileTree', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='ma3'>
      <FileTree files={files} />
    </div>
  ))
