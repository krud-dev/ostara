import ElectronStore from 'electron-store';
import { InstanceMetadata } from './model/configuration';

export const instanceMetadataStore = new ElectronStore<{ [key: string]: InstanceMetadata }>({
  name: 'boost_instance_data',
});
