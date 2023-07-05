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
import { UpdateInfo } from 'electron-updater';
import { isMac, isWindows } from 'renderer/utils/platformUtils';
import { LATEST_RELEASE_URL } from 'renderer/constants/ui';
import { onlineManager } from '@tanstack/react-query';
import semverGt from 'semver/functions/gt';

export type AppUpdatesContextProps = {
  appVersion: string;
  autoUpdateSupported: boolean;
  checkForUpdatesLoading: boolean;
  checkForUpdatesCompleted: boolean;
  downloadUpdateLoading: boolean;
  newVersionInfo: UpdateInfo | undefined;
  newVersionDownloaded: UpdateInfo | undefined;
  updateError: Error | undefined;
  checkForUpdates: () => Promise<UpdateInfo | undefined>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => void;
};

const AppUpdatesContext = React.createContext<AppUpdatesContextProps>(undefined!);

interface AppUpdatesProviderProps extends PropsWithChildren<any> {}

const AppUpdatesProvider: FunctionComponent<AppUpdatesProviderProps> = ({ children }) => {
  const [appVersion, setAppVersion] = useState<string>('');
  const [checkForUpdatesLoading, setCheckForUpdatesLoading] = useState<boolean>(false);
  const [checkForUpdatesCompleted, setCheckForUpdatesCompleted] = useState<boolean>(false);
  const [downloadUpdateLoading, setDownloadUpdateLoading] = useState<boolean>(false);
  const [newVersionInfo, setNewVersionInfo] = useState<UpdateInfo | undefined>(undefined);
  const [newVersionDownloaded, setNewVersionDownloaded] = useState<UpdateInfo | undefined>(undefined);
  const [updateError, setUpdateError] = useState<Error | undefined>(undefined);
  const [networkStateFlag, setNetworkStateFlag] = useState<boolean>(true);

  const autoUpdateSupported = useMemo<boolean>(() => isMac || isWindows, []);

  useEffect(() => {
    (async () => {
      setAppVersion(await window.ui.getAppVersion());
    })();
  }, []);

  useEffect(() => {
    if (!onlineManager.isOnline()) {
      return;
    }

    (async () => {
      await checkForUpdates();
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

  const isValidAppUpdate = useCallback(
    (updateInfo: UpdateInfo, currentAppVersion: string): boolean => semverGt(updateInfo.version, currentAppVersion),
    []
  );

  const subscribeToUpdateAvailableState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToUpdateAvailableState.mutateAsync({
        event: 'app:updateAvailable',
        listener: (event: IpcRendererEvent, updateInfo: UpdateInfo) => {
          (async () => {
            const currentAppVersion = await window.ui.getAppVersion();
            if (isValidAppUpdate(updateInfo, currentAppVersion)) {
              setNewVersionInfo(updateInfo);
            }
          })();
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
          (async () => {
            const currentAppVersion = await window.ui.getAppVersion();
            if (isValidAppUpdate(updateInfo, currentAppVersion)) {
              setNewVersionDownloaded(updateInfo);
            }
          })();
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const subscribeToUpdateErrorState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToUpdateErrorState.mutateAsync({
        event: 'app:updateError',
        listener: (event: IpcRendererEvent, error: Error) => {
          setUpdateError(error);
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

    setUpdateError(undefined);
    setCheckForUpdatesLoading(true);

    const updateInfo = await window.appUpdater.checkForUpdates();
    const currentAppVersion = await window.ui.getAppVersion();

    setCheckForUpdatesLoading(false);
    setCheckForUpdatesCompleted(true);

    if (!updateInfo || !isValidAppUpdate(updateInfo, currentAppVersion)) {
      return undefined;
    }

    setNewVersionInfo(updateInfo);
    return updateInfo;
  }, [setCheckForUpdatesLoading, setNewVersionInfo]);

  const downloadUpdate = useCallback(async (): Promise<void> => {
    if (downloadUpdateLoading) {
      return;
    }

    setUpdateError(undefined);
    setDownloadUpdateLoading(true);

    if (autoUpdateSupported) {
      await window.appUpdater.downloadUpdate();
    } else {
      window.open(LATEST_RELEASE_URL, '_blank');
    }

    setDownloadUpdateLoading(false);
  }, [downloadUpdateLoading, autoUpdateSupported]);

  const installUpdate = useCallback((): void => {
    if (!autoUpdateSupported) {
      return;
    }
    window.appUpdater.quitAndInstall();
  }, [autoUpdateSupported]);

  const memoizedValue = useMemo<AppUpdatesContextProps>(
    () => ({
      appVersion,
      autoUpdateSupported,
      checkForUpdatesLoading,
      checkForUpdatesCompleted,
      downloadUpdateLoading,
      newVersionInfo,
      newVersionDownloaded,
      updateError,
      checkForUpdates,
      downloadUpdate,
      installUpdate,
    }),
    [
      appVersion,
      autoUpdateSupported,
      checkForUpdatesLoading,
      checkForUpdatesCompleted,
      downloadUpdateLoading,
      newVersionInfo,
      newVersionDownloaded,
      updateError,
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
