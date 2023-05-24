import { LocaleInfo } from 'renderer/lang/lang';
import enLang from './entries/en-US';
import heLang from './entries/he-IL';

const locales: { [key: string]: LocaleInfo } = {
  en: enLang,
  he: heLang,
};

export default locales;
