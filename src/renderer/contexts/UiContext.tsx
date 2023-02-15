import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react';
import { LocaleInfo } from 'renderer/lang/lang';
import locales from 'renderer/lang';
import { useSubscribeToEvent } from 'renderer/apis/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { ElectronTheme, ThemeSource } from 'infra/ui/models/electronTheme';
import { useGetThemeSource } from 'renderer/apis/ui/getThemeSource';
import { useSetThemeSource } from 'renderer/apis/ui/setThemeSource';
import { useGetTheme } from 'renderer/apis/ui/getTheme';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export type UiContextProps = {
  developerMode: boolean;
  setDeveloperMode: (developerMode: boolean) => void;
  themeSource: ThemeSource;
  setThemeSource: (themeSource: ThemeSource) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  localeInfo: LocaleInfo;
  setLocale: (locale: string) => void;
  isRtl: boolean;
};

const UiContext = React.createContext<UiContextProps>(undefined!);

interface UiProviderProps extends PropsWithChildren<any> {}

const UiProvider: FunctionComponent<UiProviderProps> = ({ children }) => {
  const [developerMode, setDeveloperMode] = useLocalStorageState<boolean>('developerMode', false);

  const [themeSource, setThemeSourceInternal] = useLocalStorageState<ThemeSource>('themeSource', 'system');
  const [darkMode, setDarkMode] = useLocalStorageState<boolean>('darkMode', true);

  const [locale, setLocaleInternal] = useLocalStorageState<string>('locale', 'en');
  const localeInfo = useMemo<LocaleInfo>(() => locales[locale], [locale]);

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

  const isRtl = useMemo<boolean>(() => localeInfo.direction === 'rtl', [localeInfo]);

  // const subscribeToThemeEventsState = useSubscribeToEvent();
  //
  // useEffect(() => {
  //   let unsubscribe: (() => void) | undefined;
  //   (async () => {
  //     unsubscribe = await subscribeToThemeEventsState.mutateAsync({
  //       event: 'app:themeUpdated',
  //       listener: (event: IpcRendererEvent, data: ElectronTheme) => {
  //         setDarkMode(data.shouldUseDarkColors);
  //       },
  //     });
  //   })();
  //   return () => {
  //     unsubscribe?.();
  //   };
  // }, []);

  return (
    <UiContext.Provider
      value={{
        developerMode,
        setDeveloperMode,
        themeSource,
        setThemeSource,
        darkMode,
        setDarkMode,
        localeInfo,
        setLocale,
        isRtl,
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
