import ElectronStore from 'electron-store';
import { Configuration } from './model/configuration';

export const configurationStore = new ElectronStore<Configuration>({
  name: 'boost_configuration',
});
