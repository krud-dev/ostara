import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { useUpdateEffect } from 'react-use';
import { UpdateInfo } from 'electron-updater';
import { isMac } from '../utils/platformUtils';
import { LATEST_RELEASE_URL } from '../constants/ui';

export type AppUpdatesDownloadType = 'external' | 'internal';

export type AppUpdatesContextProps = {
  autoUpdateSupported: boolean;
  autoUpdateEnabled: boolean;
  setAutoUpdateEnabled: (autoUpdateEnabled: boolean) => void;
  newVersionInfo: UpdateInfo | undefined;
  newVersionDownloaded: UpdateInfo | undefined;
  checkForUpdates: () => Promise<UpdateInfo | undefined>;
  downloadUpdate: () => AppUpdatesDownloadType;
  installUpdate: () => void;
};

const AppUpdatesContext = React.createContext<AppUpdatesContextProps>(undefined!);

interface AppUpdatesProviderProps extends PropsWithChildren<any> {}

const AppUpdatesProvider: FunctionComponent<AppUpdatesProviderProps> = ({ children }) => {
  const autoUpdateSupported = useMemo<boolean>(() => isMac, []);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(window.configurationStore.isAutoUpdateEnabled());
  const [newVersionInfo, setNewVersionInfo] = useState<UpdateInfo | undefined>(undefined);
  const [newVersionDownloaded, setNewVersionDownloaded] = useState<UpdateInfo | undefined>(undefined);

  useUpdateEffect(() => {
    window.configurationStore.setAutoUpdateEnabled(autoUpdateEnabled);
  }, [autoUpdateEnabled]);

  useEffect(() => {
    (async () => {
      const updateInfo = await window.appUpdater.checkForUpdates();
      if (updateInfo) {
        setNewVersionInfo(updateInfo);
      }
    })();
  }, []);

  const subscribeToUpdateAvailableState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToUpdateAvailableState.mutateAsync({
        event: 'app:updateAvailable',
        listener: (event: IpcRendererEvent, updateInfo: UpdateInfo) => {
          setNewVersionInfo(updateInfo);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const subscribeToUpdateDownloadedState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToUpdateDownloadedState.mutateAsync({
        event: 'app:updateDownloaded',
        listener: (event: IpcRendererEvent, updateInfo: UpdateInfo) => {
          setNewVersionDownloaded(updateInfo);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const checkForUpdates = useCallback(async (): Promise<UpdateInfo | undefined> => {
    const updateInfo = await window.appUpdater.checkForUpdates();
    if (updateInfo) {
      setNewVersionInfo(updateInfo);
    }
    return updateInfo;
  }, [setNewVersionInfo]);

  const downloadUpdate = useCallback((): AppUpdatesDownloadType => {
    if (autoUpdateSupported) {
      window.appUpdater.downloadUpdate();
      return 'internal';
    }
    window.open(LATEST_RELEASE_URL, '_blank');
    return 'external';
  }, [autoUpdateSupported]);

  const installUpdate = useCallback((): void => {
    if (!autoUpdateSupported) {
      return;
    }
    window.appUpdater.quitAndInstall();
  }, [autoUpdateSupported]);

  return (
    <AppUpdatesContext.Provider
      value={{
        autoUpdateSupported,
        autoUpdateEnabled,
        setAutoUpdateEnabled,
        newVersionInfo,
        newVersionDownloaded,
        checkForUpdates,
        downloadUpdate,
        installUpdate,
      }}
    >
      {children}
    </AppUpdatesContext.Provider>
  );
};

const useAppUpdates = (): AppUpdatesContextProps => {
  const context = useContext(AppUpdatesContext);

  if (!context) throw new Error('AppUpdatesContext must be used inside AppUpdatesProvider');

  return context;
};

export { AppUpdatesContext, AppUpdatesProvider, useAppUpdates };
