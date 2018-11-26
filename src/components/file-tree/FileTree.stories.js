import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import i18n from '../../i18n-decorator'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import FileTree from './FileTree'
import files from './fixtures/root.json'

storiesOf('FileTree', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .addDecorator(story => (
    <Provider store={getStore()}>
      { story() }
    </Provider>
  ))
  .add('Add', () => (
    <div className='ma3 sans-serif'>
      <FileTree files={files.add} />
    </div>
  ))
  .add('Download', () => (
    <div className='ma3 sans-serif'>
      <FileTree files={files.download} isDownload />
    </div>
  ))
