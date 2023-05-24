import { LocaleInfo } from 'renderer/lang/lang';
import { heIL } from '@mui/material/locale';
import heLocale from 'date-fns/locale/he';
import heMessages from '../locales/he_IL';
import enMessages from '../locales/en_US';
import { heFlag } from 'renderer/images/flags';

const HeLang: LocaleInfo = {
  id: 'he',
  locale: 'he-IL',
  messages: {
    ...enMessages,
    ...heMessages,
  },
  name: 'עברית',
  shortName: 'עב',
  icon: heFlag,
  direction: 'rtl',
  materialUiLocalization: heIL,
  dateLocalization: heLocale,
};
export default HeLang;
