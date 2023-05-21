import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LocaleInfo } from 'renderer/lang/lang';
import locales from 'renderer/lang';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { ElectronTheme, ThemeSource } from 'infra/ui/models/electronTheme';
import { useGetThemeSource } from 'renderer/apis/requests/ui/getThemeSource';
import { useSetThemeSource } from 'renderer/apis/requests/ui/setThemeSource';
import { useGetTheme } from 'renderer/apis/requests/ui/getTheme';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '../routes/urls';
import { useUpdateEffect } from 'react-use';
import { UpdateInfo } from 'electron-updater';

export type SettingsContextProps = {
  developerMode: boolean;
  daemonHealthy: boolean;
  themeSource: ThemeSource;
  setThemeSource: (themeSource: ThemeSource) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  localeInfo: LocaleInfo;
  setLocale: (locale: string) => void;
  isRtl: boolean;
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (analyticsEnabled: boolean) => void;
  errorReportingEnabled: boolean;
  errorReportingChanged: boolean;
  setErrorReportingEnabled: (errorReportingEnabled: boolean) => void;
  autoUpdateSupported: boolean;
  autoUpdateEnabled: boolean;
  setAutoUpdateEnabled: (autoUpdateEnabled: boolean) => void;
  newVersionInfo: UpdateInfo | undefined;
};

const SettingsContext = React.createContext<SettingsContextProps>(undefined!);

interface SettingsProviderProps extends PropsWithChildren<any> {}

const SettingsProvider: FunctionComponent<SettingsProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const developerMode = useMemo<boolean>(
    () => window.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true',
    []
  );

  const [daemonHealthy, setDaemonHealthy] = useState<boolean>(window.daemonHealthy());

  const [themeSource, setThemeSourceInternal] = useLocalStorageState<ThemeSource>('themeSource', 'system');
  const [darkMode, setDarkMode] = useLocalStorageState<boolean>('darkMode', true);

  const [locale, setLocaleInternal] = useLocalStorageState<string>('locale', 'en');
  const localeInfo = useMemo<LocaleInfo>(() => locales[locale], [locale]);

  const isRtl = useMemo<boolean>(() => localeInfo.direction === 'rtl', [localeInfo]);

  const [analyticsEnabled, setAnalyticsEnabled] = useLocalStorageState<boolean>('analyticsEnabled', true);

  const errorReportingInitialState = useMemo<boolean>(() => window.configurationStore.isErrorReportingEnabled(), []);
  const [errorReportingEnabled, setErrorReportingEnabled] = useState<boolean>(errorReportingInitialState);
  const errorReportingChanged = useMemo<boolean>(
    () => errorReportingEnabled !== errorReportingInitialState,
    [errorReportingEnabled]
  );

  useUpdateEffect(() => {
    window.configurationStore.setErrorReportingEnabled(errorReportingEnabled);
  }, [errorReportingEnabled]);

  const autoUpdateSupported = useMemo<boolean>(() => false, []);

  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(window.configurationStore.isAutoUpdateEnabled());

  useUpdateEffect(() => {
    window.configurationStore.setAutoUpdateEnabled(autoUpdateEnabled);
  }, [autoUpdateEnabled]);

  const [newVersionInfo, setNewVersionInfo] = useState<UpdateInfo | undefined>(undefined);

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

  useEffect(() => {
    const newPathname = daemonHealthy ? urls.home.url : urls.daemonUnhealthy.url;
    if (newPathname !== pathname) {
      navigate(newPathname);
    }
  }, [daemonHealthy]);

  const getThemeState = useGetTheme();

  useEffect(() => {
    (async () => {
      try {
        const updatedTheme = await getThemeState.mutateAsync({});
        setDarkMode(updatedTheme.shouldUseDarkColors);
      } catch (e) {}
    })();
  }, []);

  const getThemeSourceState = useGetThemeSource();

  useEffect(() => {
    (async () => {
      try {
        const updatedThemeSource = await getThemeSourceState.mutateAsync({});
        setThemeSourceInternal(updatedThemeSource);
      } catch (e) {}
    })();
  }, []);

  const setThemeSourceState = useSetThemeSource({ refetchNone: true });

  const setThemeSource = useCallback(
    (newThemeSource: ThemeSource): void => {
      setThemeSourceInternal(newThemeSource);
      setThemeSourceState.mutate({ themeSource: newThemeSource });
    },
    [setLocaleInternal]
  );

  const setLocale = useCallback(
    (newLocale: string): void => {
      if (locales[newLocale]) {
        setLocaleInternal(newLocale);
      }
    },
    [setLocaleInternal]
  );

  const subscribeToDaemonUnhealthyState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToDaemonUnhealthyState.mutateAsync({
        event: 'app:daemonUnhealthy',
        listener: (event: IpcRendererEvent) => {
          setDaemonHealthy(false);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const subscribeToDaemonHealthyState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToDaemonHealthyState.mutateAsync({
        event: 'app:daemonHealthy',
        listener: (event: IpcRendererEvent) => {
          setDaemonHealthy(true);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const subscribeToThemeEventsState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToThemeEventsState.mutateAsync({
        event: 'app:themeUpdated',
        listener: (event: IpcRendererEvent, data: ElectronTheme) => {
          setDarkMode(data.shouldUseDarkColors);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        developerMode,
        daemonHealthy,
        themeSource,
        setThemeSource,
        darkMode,
        setDarkMode,
        localeInfo,
        setLocale,
        isRtl,
        analyticsEnabled,
        setAnalyticsEnabled,
        errorReportingEnabled,
        errorReportingChanged,
        setErrorReportingEnabled,
        autoUpdateSupported,
        autoUpdateEnabled,
        setAutoUpdateEnabled,
        newVersionInfo,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('SettingsContext must be used inside SettingsProvider');

  return context;
};

export { SettingsContext, SettingsProvider, useSettings };
