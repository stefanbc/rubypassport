import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationDE from './locales/de.json'
import translationEN from './locales/en.json'
import translationRO from './locales/ro.json'
import translationES from './locales/es.json'

// the translations
const resources = {
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  ro: {
    translation: translationRO,
  },
  es: {
    translation: translationES,
  },
}

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use 'en' if detected language is not available
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
