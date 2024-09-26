import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'
import React from 'react'
import i18n from '../../i18n-decorator'
import { TranslatedFile as File } from './File'

const wrapperClass = 'ma3 sans-serif'

storiesOf('File', module)
  .addDecorator(checkA11y)
  .addDecorator(i18n)
  .add('Adding', () => (
    <div className={wrapperClass}>
      <File
        cid='Qm3fsA'
        name='game-of-thrones.mkv'
        size={265318832}
        progress={70} />
    </div>
  ))
  .add('Added', () => (
    <div className={wrapperClass}>
      <File
        cid='Qm3fsA'
        name='game-of-thrones.mkv'
        size={265318832}
        progress={100} />
    </div>
  ))
  .add('Errored', () => (
    <div className={wrapperClass}>
      <File
        cid='Qm3fsA'
        name='game-of-thrones.mkv'
        size={265318832}
        progress={100}
        error={'error'} />
    </div>
  ))
  .add('Download', () => (
    <div className={wrapperClass}>
      <File
        cid='Qm3fsA'
        name='game-of-thrones.mkv'
        size={265318832}
        progress={100}
        isDownload />
    </div>
  ))
