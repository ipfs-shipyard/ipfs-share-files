import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import i18n from '../../i18n-decorator'
import { BoxAdd, BoxDownload, BoxNotAvailable } from './Box'

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
      <BoxAdd />
    </div>
  ))
  .add('Download', () => (
    <div className={wrapperClass}>
      <BoxDownload isDownload />
    </div>
  ))
  .add('Not Available', () => (
    <div className={wrapperClass}>
      <BoxNotAvailable />
    </div>
  ))
