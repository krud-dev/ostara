import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { useUpdateEffect } from 'react-use';
import { UpdateInfo } from 'electron-updater';
import { isMac, isWindows } from 'renderer/utils/platformUtils';
import { LATEST_RELEASE_URL } from 'renderer/constants/ui';
import semverGte from 'semver/functions/gte';
import { onlineManager } from '@tanstack/react-query';

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
  const autoUpdateSupported = useMemo<boolean>(() => isMac || isWindows, []);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(window.configurationStore.isAutoUpdateEnabled());
  const [newVersionInfo, setNewVersionInfo] = useState<UpdateInfo | undefined>(undefined);
  const [newVersionDownloaded, setNewVersionDownloaded] = useState<UpdateInfo | undefined>(undefined);
  const [networkStateFlag, setNetworkStateFlag] = useState<boolean>(true);

  useUpdateEffect(() => {
    window.configurationStore.setAutoUpdateEnabled(autoUpdateEnabled);
  }, [autoUpdateEnabled]);

  useEffect(() => {
    if (!onlineManager.isOnline()) {
      return;
    }

    (async () => {
      const updateInfo = await window.appUpdater.checkForUpdates();
      if (updateInfo) {
        setNewVersionInfo(updateInfo);
      }
    })();
  }, [networkStateFlag]);

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      setNetworkStateFlag((prev) => !prev);
    });
    return () => {
      unsubscribe();
    };
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
    if (!onlineManager.isOnline()) {
      return undefined;
    }

    const updateInfo = await window.appUpdater.checkForUpdates();
    const appVersion = await window.ui.getAppVersion();

    if (!updateInfo || semverGte(appVersion, updateInfo.version)) {
      return undefined;
    }

    setNewVersionInfo(updateInfo);
    return updateInfo;
  }, [setNewVersionInfo]);

  const downloadUpdateStarted = useRef<boolean>(false);

  const downloadUpdate = useCallback((): AppUpdatesDownloadType => {
    if (autoUpdateSupported) {
      if (!downloadUpdateStarted.current) {
        window.appUpdater.downloadUpdate();
        downloadUpdateStarted.current = true;
      }
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

  const memoizedValue = useMemo<AppUpdatesContextProps>(
    () => ({
      autoUpdateSupported,
      autoUpdateEnabled,
      setAutoUpdateEnabled,
      newVersionInfo,
      newVersionDownloaded,
      checkForUpdates,
      downloadUpdate,
      installUpdate,
    }),
    [
      autoUpdateSupported,
      autoUpdateEnabled,
      setAutoUpdateEnabled,
      newVersionInfo,
      newVersionDownloaded,
      checkForUpdates,
      downloadUpdate,
      installUpdate,
    ]
  );

  return <AppUpdatesContext.Provider value={memoizedValue}>{children}</AppUpdatesContext.Provider>;
};

const useAppUpdatesContext = (): AppUpdatesContextProps => {
  const context = useContext(AppUpdatesContext);

  if (!context) throw new Error('AppUpdatesContext must be used inside AppUpdatesProvider');

  return context;
};

export { AppUpdatesContext, AppUpdatesProvider, useAppUpdatesContext };
