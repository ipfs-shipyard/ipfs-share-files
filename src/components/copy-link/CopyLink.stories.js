import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import i18n from '../../i18n-decorator'
import CopyLink from './CopyLink'

const shareLink = 'share.ipfs.io/QmXAeNYRRnD8RGvxHUiVp4ffh8FDynyRMPjcGFhnVzPHUt'

const wrapperClass = 'flex flex-auto pa3 bg-navy sans-serif'

storiesOf('CopyLink', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('Default', () => (
    <div className={wrapperClass}>
      <CopyLink shareLink={shareLink} />
    </div>
  ))
  .add('Without Label', () => (
    <div className={wrapperClass}>
      <CopyLink shareLink={shareLink} withLabel={false} />
    </div>
  ))
