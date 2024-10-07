import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { BoxAdd, BoxDownload, BoxNotAvailable } from '../components/box/Box'
import Headline from '../components/headline/Headline'
import { Info } from '../components/info/Info'
import { useCurrentPage } from '../hooks/useCurrentPage'
import { useHelia } from '../hooks/useHelia'

export const Page = (): React.JSX.Element => {
  const [t] = useTranslation()
  const currentPage = useCurrentPage()
  const heliaState = useHelia()
  const isDownload = currentPage === 'download'
  let content

  if (heliaState.error != null) {
    content = <BoxNotAvailable error={heliaState.error} />
  } else if (isDownload) {
    content = <BoxDownload />
  } else {
    content = <BoxAdd />
  }

  return (
    <div data-id='Page'>
      <Helmet>
        <title>{t('pageTitle.ipfs')} | { isDownload ? t('pageTitle.download') : t('pageTitle.add') }</title>
      </Helmet>
      <Headline isDownload={isDownload} />

      <div className='flex flex-column flex-row-l items-start'>
        { content }
        <Info isDownload={isDownload} />
      </div>
    </div>
  )
}
