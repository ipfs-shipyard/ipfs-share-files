import i18n from 'i18next'
import ICU from 'i18next-icu'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Locales
import en from 'i18next-icu/locale-data/en'
import pt from 'i18next-icu/locale-data/pt'

i18n
  .use(new ICU({
    localeData: [en, pt]
  }))
  .use(XHR)
  .use(LanguageDetector)
  .init({
    fallbackLng: {
      'zh-Hans': ['zh-CN', 'en'],
      'zh-Hant': ['zh-TW', 'en'],
      'zh': ['zh-CN', 'en'],
      'default': ['en']
    },
    debug: process.env.NODE_ENV !== 'production',
    backend: {
      // ensure a realtive path is used to look up the locales, so it works when used from /ipfs/<cid>
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    },
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  })

export default i18n
