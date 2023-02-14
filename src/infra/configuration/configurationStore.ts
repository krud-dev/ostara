import ElectronStore from 'electron-store';
import { Configuration } from './model/Configuration';
import { DEFAULT_ROWS_PER_PAGE, SIDEBAR_DEFAULT_WIDTH } from '../../renderer/constants/ui';

const defaults: Configuration = {
  developerMode: false,
  darkMode: false,
  themeSource: 'system',
  locale: 'en-US',
  sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
  secondarySidebarWidth: SIDEBAR_DEFAULT_WIDTH,
  tableRowsPerPage: DEFAULT_ROWS_PER_PAGE,
};
export const configurationStore = new ElectronStore<Configuration>({
  name: 'boost_configuration',
  defaults,
});
