import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import i18n from '../../i18n-decorator'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import { BoxUpload, BoxDownload, BoxNotAvailable } from './Box'

const files = [
  { name: 'game-of-thrones.avi', size: 989827344, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 30 },
  { name: 'chill-out.mp3', size: 5423424, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 60 },
  { name: 'fate.txt', size: 4254384, hash: 'QmSZCFFHsWbwbxU7QJ1d34HkLTVTUS6Msn3eawYjngo7yq', progress: 100 }
]

const shareLink = 'share.ipfs.io/QmXAeNYRRnD8RGvxHUiVp4ffh8FDynyRMPjcGFhnVzPHUt'

const wrapperClass = 'flex flex-auto pa3 bg-navy sans-serif'

storiesOf('Box', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .addDecorator(story => (
    <Provider store={getStore()}>
      { story() }
    </Provider>
  ))
  .add('Upload', () => (
    <div className={wrapperClass}>
      <BoxUpload files={files} shareLink={shareLink} />
    </div>
  ))
  .add('Download', () => (
    <div className={wrapperClass}>
      <BoxDownload files={files} isDownload />
    </div>
  ))
  .add('Not Available', () => (
    <div className={wrapperClass}>
      <BoxNotAvailable />
    </div>
  ))
