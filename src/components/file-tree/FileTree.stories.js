import React from 'react'
import { storiesOf } from '@storybook/react'
import { checkA11y } from '@storybook/addon-a11y'
import { Provider } from 'redux-bundler-react'
import getStore from '../../bundles'
import FileTree from './FileTree'
import files from './fixtures/root.json'

storiesOf('FileTree', module)
  .addDecorator(checkA11y)
  .addDecorator(story => (
    <Provider store={getStore()}>
      { story() }
    </Provider>
  ))
  .add('Default', () => (
    <div className='ma3 sans-serif'>
      <FileTree files={files} />
    </div>
  ))
