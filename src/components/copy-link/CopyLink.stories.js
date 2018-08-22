import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import CopyLink from './CopyLink'

const shareLink = 'share.ipfs.io/QmXAeNYRRnD8RGvxHUiVp4ffh8FDynyRMPjcGFhnVzPHUt'

storiesOf('CopyLink', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <div className='flex flex-auto pa3 bg-navy'>
      <CopyLink shareLink={shareLink} />
    </div>
  ))
  .add('Without Label', () => (
    <div className='flex flex-auto pa3 bg-navy'>
      <CopyLink shareLink={shareLink} withLabel={false} />
    </div>
  ))
