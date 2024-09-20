import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'

export const CopyLink = ({shareLink, withLabel}: {shareLink: string, withLabel?: boolean}) => {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()
  const handleOnCopyClick = useCallback(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [])
  const copyBtnClass = classnames({
    'o-50 no-pointer-events': copied,
    'o-80 glow pointer': !copied
  }, ['pa2 w3 flex items-center justify-center br-pill bg-navy f7 white'])

  return (
    <div>
      { withLabel && <div className='f5 montserrat fw4 charcoal mt4 mb1'>{t('copyLink.labelAll')}</div> }
      <div className='f7 charcoal-muted lh-copy'>
        {t('copyLink.footNote')}
      </div>
      <div className='pa1 mt2 mb3 w-100 flex items-center justify-between br-pill bg-light-gray'>
        <div className='ph2 w-80 f7 navy truncate'>
          { shareLink }
        </div>
        <CopyToClipboard text={shareLink} onCopy={handleOnCopyClick}>
          <div className={copyBtnClass}>
            { copied ? t('copyLink.copied') : t('copyLink.copy') }
          </div>
        </CopyToClipboard>
      </div>
      <div className="overflow-hidden">
        <div className="flex flex-column items-center mb3 appear-from-below">
          <span className="f7 charcoal-muted lh-copy pb2">{t('copyLink.qrLabel')}</span>
          <QRCode
            value={shareLink}
            bgColor={'#ffffff'}
            fgColor={'#022E44'}
            level={'M'}
            renderAs={'svg'}
            imageSettings={{
              src: 'favicon-32x32.png',
              x: null,
              y: null,
              height: 32,
              width: 32,
              excavate: true
            }}
          />
        </div>
      </div>
    </div>
  )
}

