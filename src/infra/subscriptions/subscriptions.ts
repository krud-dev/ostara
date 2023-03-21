import { IpcRendererEvent } from 'electron';
import { ElectronTheme } from '../ui/models/electronTheme';

export type Subscriptions = {
  'app:themeUpdated': (event: IpcRendererEvent, data: ElectronTheme) => void;
  'app:daemonHealthy': (event: IpcRendererEvent) => void;
  'app:daemonUnhealthy': (event: IpcRendererEvent) => void;
  'trigger:openSettings': (event: IpcRendererEvent) => void;
};
