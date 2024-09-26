import i18n from 'i18next'
import React, { useState } from 'react'
import { Trans } from 'react-i18next'
import { localesList } from '../../i18n'
import LanguagePicker from '../../media/images/Language'
import Dropdown from '../dropdown/Dropdown'

const Footer = () => {
  const anchorClass = 'no-underline underline-hover aqua'
  const defaultLanguage = window.localStorage.getItem('i18nextLng')?.split('-')[0]
  const [selectedLanguage, setLanguage] = useState(defaultLanguage)

  const onLocaleChange = (locale) => {
    window.localStorage.setItem('i18nextLng', locale)
    setLanguage(locale)
    i18n.changeLanguage(locale)
  }

  return (
    <div className='flex-ns items-center pt5 pb3 ph4 f7 white '>
      <div className="mr2 pb1">
        <Trans i18nKey='powered-by-helia'>
          Powered by <a className={anchorClass} href="https://github.com/ipfs/helia" title="Helia" target='_blank' rel='noopener noreferrer'>Helia</a>
        </Trans>
      </div>
      <div className='mr2 pb1 dn dib-ns'>
          |
      </div>
      <div className='pb1'>
        <Trans i18nKey='footer'>
          Licensed <a className={anchorClass} href='https://creativecommons.org/licenses/by/3.0/' target='_blank' rel='noopener noreferrer'>CC-BY 3.0</a> except as <a className={anchorClass} href='https://protocol.ai/legal/' target='_blank' rel='noopener noreferrer'>noted</a>
        </Trans>
      </div>
      <div className='flex items-center pv2'>
        <div className='mh2 pb1 dn dib-ns'>
          |
        </div>
        <div className="mh1">
          <a className="mr1" href="https://github.com/ipfs/helia" title="Helia" target='_blank' rel='noopener noreferrer'>
            <img src="https://raw.githubusercontent.com/ipfs/helia/main/assets/helia.png" alt="Helia logo" height="30px" />
          </a>
        </div>
        <div className="mh1">
          <a href="https://github.com/ipfs-shipyard/ipfs-share-files" target='_blank' rel='noopener noreferrer'>
          <svg height="24" width="24" viewBox="0 0 16 16" version="1.1">
            <path fill="#fff" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          </a>
        </div>
        <Dropdown className="ml1" options={localesList} Icon={LanguagePicker} onChange={onLocaleChange} selectedOption={selectedLanguage}/>
      </div>
    </div>
  )
}

export default Footer
