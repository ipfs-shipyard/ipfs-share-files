import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import i18n from '../../i18n-decorator'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import { BoxAdd, BoxDownload, BoxNotAvailable } from './Box'
import fixtures from './fixtures/root.json'

const wrapperClass = 'flex flex-auto pa3 bg-navy sans-serif'

storiesOf('Box', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .addDecorator(story => (
    <Provider store={getStore()}>
      { story() }
    </Provider>
  ))
  .add('Add', () => (
    <div className={wrapperClass}>
      <BoxAdd files={fixtures.files} shareLink={fixtures.shareLink} />
    </div>
  ))
  .add('Download', () => (
    <div className={wrapperClass}>
      <BoxDownload files={fixtures.files} isDownload />
    </div>
  ))
  .add('Not Available', () => (
    <div className={wrapperClass}>
      <BoxNotAvailable />
    </div>
  ))
