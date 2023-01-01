import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useConfigurationStoreState from 'renderer/hooks/useConfigurationStoreState';
import { LocaleInfo } from 'renderer/lang/lang';
import locales from 'renderer/lang';

export type UiContextProps = {
  developerMode: boolean;
  toggleDeveloperMode: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  localeInfo: LocaleInfo;
  setLocale: (locale: string) => void;
  isRtl: boolean;
};

const UiContext = React.createContext<UiContextProps>(undefined!);

interface UiProviderProps extends PropsWithChildren<any> {}

const UiProvider: FunctionComponent<UiProviderProps> = ({ children }) => {
  const [developerMode, setDeveloperMode] = useConfigurationStoreState<boolean>('developerMode', false);
  const [darkMode, setDarkMode] = useConfigurationStoreState<boolean>('darkMode', true);
  const [locale, setLocaleInternal] = useConfigurationStoreState<string>('locale', 'en');
  const localeInfo = useMemo<LocaleInfo>(() => locales[locale], [locale]);

  const toggleDeveloperMode = useCallback((): void => {
    setDeveloperMode((prev) => !prev);
  }, [setDeveloperMode]);

  const toggleDarkMode = useCallback((): void => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  const setLocale = useCallback(
    (newLocale: string): void => {
      if (locales[newLocale]) {
        setLocaleInternal(newLocale);
      }
    },
    [setLocaleInternal]
  );

  const isRtl = useMemo<boolean>(() => localeInfo.direction === 'rtl', [localeInfo]);

  return (
    <UiContext.Provider
      value={{
        developerMode,
        toggleDeveloperMode,
        darkMode,
        toggleDarkMode,
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
