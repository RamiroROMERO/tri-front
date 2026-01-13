import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const common_en = require('../lngProvider/en/en-US.json');
const common_es = require('../lngProvider/es/es-ES.json');

const langs = ['es', 'en'];
const navigatorLang = window.navigator.language.substring(0, 2)
const langSelected = langs.includes(navigatorLang)? navigatorLang : "en";

const i18nSettings = {
  resources: {
    en: {
      translation: common_en
    },
    es: {
      translation: common_es
    }
  },
  lng: langSelected
};

i18n.use(initReactI18next).init({...i18nSettings});

export default i18n;