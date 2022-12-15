import {
  Application,
  Folder,
  Instance,
} from 'infra/configuration/model/configuration';

export type ConfigurationItem = Folder | Application | Instance;
export type TreeItem = ConfigurationItem & { children?: TreeItem[] };
