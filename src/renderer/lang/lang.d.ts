import { Localization } from '@mui/material/locale';

export type LocaleInfo = {
  id: string;
  locale: string;
  messages: { [key: string]: string };
  name: string;
  shortName: string;
  icon: string;
  direction: 'ltr' | 'rtl';
  materialUiLocalization: Localization;
  dateLocalization: Locale;
}
