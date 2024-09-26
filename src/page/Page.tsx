import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
// Components
import { BoxAdd, BoxDownload, BoxNotAvailable } from '../components/box/Box'
import Headline from '../components/headline/Headline'
import { Info } from '../components/info/Info'
import { useCurrentPage } from '../hooks/useCurrentPage'
import { useFiles } from '../hooks/useFiles'
import { useHelia } from '../hooks/useHelia'

export const Page = (): React.JSX.Element => {
  const [t] = useTranslation()
  const currentPage = useCurrentPage()
  const heliaState = useHelia()
  const { fetch } = useFiles()
  const isDownload = currentPage === 'download'
  let content
  // debugger
  if (heliaState.error) {
    content = <BoxNotAvailable />
  } else if (isDownload) {
    content = <BoxDownload />
  } else {
    content = <BoxAdd isLoading={fetch.loading} />
  }
  const headline = <Headline isDownload={isDownload} />
  const info = <Info isDownload={isDownload} />

  // TODO: reimplement this:
  // if the hash has changed, reset the files
  //  and if the hash is a cid, fetch the new file tree
  //
  // handleRouting (prevProps) {
  //   const { doUpdateHash, doFetchFileTree, doResetFiles } = this.props
  //   const prevHash = prevProps && prevProps.routeInfo.params.hash
  //   const currentHash = this.props.routeInfo.params.hash

  //   if (prevHash !== currentHash) {
  //     doResetFiles()
  //     cid(currentHash) ? doFetchFileTree(currentHash) : doUpdateHash('#/')
  //   }
  // }

  return (
    <div data-id='Page'>
      <Helmet>
        <title>{t('pageTitle.ipfs')} | { isDownload ? t('pageTitle.download') : t('pageTitle.add') }</title>
      </Helmet>
      { headline }

      <div className='flex flex-column flex-row-l items-start'>
        { content }
        { info }
      </div>
    </div>
  )
}
