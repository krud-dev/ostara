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

export type UiContextProps = {
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
};

const UiContext = React.createContext<UiContextProps>(undefined!);

interface UiProviderProps extends PropsWithChildren<any> {}

const UiProvider: FunctionComponent<UiProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const developerMode = useMemo<boolean>(() => window.NODE_ENV === 'development', []);

  const [daemonHealthy, setDaemonHealthy] = useState<boolean>(window.daemonHealthy());

  const [themeSource, setThemeSourceInternal] = useLocalStorageState<ThemeSource>('themeSource', 'system');
  const [darkMode, setDarkMode] = useLocalStorageState<boolean>('darkMode', true);

  const [locale, setLocaleInternal] = useLocalStorageState<string>('locale', 'en');
  const localeInfo = useMemo<LocaleInfo>(() => locales[locale], [locale]);

  const isRtl = useMemo<boolean>(() => localeInfo.direction === 'rtl', [localeInfo]);

  const [analyticsEnabled, setAnalyticsEnabled] = useLocalStorageState<boolean>('analyticsEnabled', true);

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
    <UiContext.Provider
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
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

const useUi = (): UiContextProps => {
  const context = useContext(UiContext);

  if (!context) throw new Error('UiContext must be used inside UiProvider');

  return context;
};

export { UiContext, UiProvider, useUi };
