import { enUS } from '@mui/material/locale';
import enLocale from 'date-fns/locale/en-US';
import { LocaleInfo } from 'renderer/lang/lang';
import enMessages from '../locales/en_US';
import { enFlag } from 'renderer/images/flags';

const EnLang: LocaleInfo = {
  id: 'en',
  locale: 'en-US',
  messages: {
    ...enMessages,
  },
  name: 'English',
  shortName: 'EN',
  icon: enFlag,
  direction: 'ltr',
  materialUiLocalization: enUS,
  dateLocalization: enLocale,
};
export default EnLang;
