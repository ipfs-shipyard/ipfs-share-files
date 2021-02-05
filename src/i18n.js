import i18n from 'i18next'
import ICU from 'i18next-icu'
import Backend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Locales
import en from 'i18next-icu/locale-data/en'
import ar from 'i18next-icu/locale-data/ar'
import fr from 'i18next-icu/locale-data/fr'
import pt from 'i18next-icu/locale-data/pt'

import locales from './lib/languages.json'

const localeData = [en, ar, pt, fr]

export const localesList = Object.values(locales).map(locale => ({
  value: locale.locale,
  name: locale.nativeName
}))

i18n
  .use(new ICU({ localeData }))
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
          expirationTime: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 1 : 7 * 24 * 60 * 60 * 1000
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
    debug: process.env.DEBUG,
    // react i18next special options (optional)
    react: {
      wait: true,
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  })
export default i18n
