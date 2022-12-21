import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useConfigurationStoreState from 'renderer/hooks/useConfigurationStoreState';
import { LocaleInfo } from 'renderer/lang/lang';
import locales from 'renderer/lang';

export type UiContextProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  localeInfo: LocaleInfo;
  setLocale: (locale: string) => void;
};

const UiContext = React.createContext<UiContextProps>(undefined!);

interface UiProviderProps extends PropsWithChildren<any> {}

const UiProvider: FunctionComponent<UiProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useConfigurationStoreState<boolean>('darkMode', true);
  const [locale, setLocaleInternal] = useConfigurationStoreState<string>('locale', 'en');
  const localeInfo = useMemo<LocaleInfo>(() => locales[locale], [locale]);

  const toggleDarkMode = useCallback((): void => {
    setDarkMode((currentDarkMode) => !currentDarkMode);
  }, [setDarkMode]);

  const setLocale = useCallback(
    (newLocale: string): void => {
      if (locales[newLocale]) {
        setLocaleInternal(newLocale);
      }
    },
    [setLocaleInternal]
  );

  return (
    <UiContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        localeInfo,
        setLocale,
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
