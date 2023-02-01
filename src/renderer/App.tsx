import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ThemeConfig from 'renderer/theme/ThemeConfig';
import NiceModal from '@ebay/nice-modal-react';
import NotistackProvider from 'renderer/components/snackbar/NotistackProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from 'renderer/apis/queryClient';
import { UiContext, UiProvider } from 'renderer/contexts/UiContext';
import Router from 'renderer/routes/routes';

export default function App() {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <UiProvider>
          <UiContext.Consumer>
            {({ darkMode, localeInfo }) => (
              <IntlProvider
                locale={localeInfo.locale}
                messages={localeInfo.messages}
                onError={(err) => {
                  if (err.code === 'MISSING_TRANSLATION') {
                    console.warn('Missing translation', err.message);
                    return;
                  }
                  throw err;
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeInfo.dateLocalization}>
                  <ThemeConfig
                    isDarkMode={darkMode}
                    isRtl={localeInfo.direction === 'rtl'}
                    localization={localeInfo.materialUiLocalization}
                  >
                    <NotistackProvider>
                      <NiceModal.Provider>
                        <Router />
                      </NiceModal.Provider>
                    </NotistackProvider>
                  </ThemeConfig>
                </LocalizationProvider>
              </IntlProvider>
            )}
          </UiContext.Consumer>
        </UiProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}
