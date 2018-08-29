import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import Box from './Box'

const files = [
  { name: 'game-of-thrones.avi', size: 989827344, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 30 },
  { name: 'chill-out.mp3', size: 5423424, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 60 },
  { name: 'fate.txt', size: 4254384, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 100 }
]

const shareLink = 'share.ipfs.io/QmXAeNYRRnD8RGvxHUiVp4ffh8FDynyRMPjcGFhnVzPHUt'

storiesOf('Box', module)
  .addDecorator(checkA11y)
  .addDecorator(story => (
    <Provider store={getStore()}>
      { story() }
    </Provider>
  ))
  .add('Upload', () => (
    <div className='flex flex-auto pa3 bg-navy'>
      <Box files={files} shareLink={shareLink} />
    </div>
  ))
  .add('Download', () => (
    <div className='flex flex-auto pa3 bg-navy'>
      <Box files={files} isDownload />
    </div>
  ))
