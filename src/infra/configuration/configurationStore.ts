import ElectronStore from 'electron-store';
import { Configuration } from './model/configuration';

const defaults: Configuration = {
  items: {},
};
export const configurationStore = new ElectronStore<Configuration>({
  name: 'boost_configuration',
  defaults,
});
