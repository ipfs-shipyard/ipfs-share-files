import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import ICU from 'i18next-icu'
import LocalStorageBackend from 'i18next-localstorage-backend'
import locales from './lib/languages'

export const localesList = Object.values(locales).map(locale => ({
  value: locale.locale,
  name: locale.nativeName
}))

await i18n
  .use(ICU)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,
        HttpBackend
      ],
      backendOptions: [
        { // LocalStorageBackend
          defaultVersion: 'v1',
          expirationTime: (import.meta.env.NODE_ENV == null || import.meta.env.NODE_ENV === 'development') ? 1 : 7 * 24 * 60 * 60 * 1000
        },
        { // HttpBackend
          // ensure a relative path is used to look up the locales, so it works when loaded from /ipfs/<cid>
          loadPath: 'locales/{{lng}}/{{ns}}.json'
        }
      ]
    },
    defaultNS: 'translation',
    fallbackNS: 'translation',
    fallbackLng: {
      'zh-Hans': ['zh-CN', 'en'],
      'zh-Hant': ['zh-TW', 'en'],
      zh: ['zh-CN', 'en'],
      default: ['en']
    },
    debug: import.meta.env.DEBUG,
    // react i18next special options (optional)
    react: {
      // wait: true,
      // useSuspense: false,
      bindI18n: 'languageChanged loaded',
      // bindStore: 'added removed',
      nsMode: 'default'
    }
  }, (err, t) => {
    if (err != null) console.error('i18n init error:', err)
  })

export default i18n
