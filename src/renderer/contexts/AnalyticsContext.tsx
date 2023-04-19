import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import { GOOGLE_ANALYTICS_API_SECRET, GOOGLE_ANALYTICS_MEASUREMENT_ID } from '../constants/ids';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvent, useSendEvents } from '../apis/requests/analytics/sendEvents';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import useDebouncedEffect from '../hooks/useDebouncedEffect';
import { findLast, isEmpty } from 'lodash';
import { UrlInfo, urls } from '../routes/urls';

export type AnalyticsContextProps = {
  addEvents: (events: AnalyticsEvent[]) => void;
};

const AnalyticsContext = React.createContext<AnalyticsContextProps>(undefined!);

interface AnalyticsProviderProps extends PropsWithChildren<any> {}

const AnalyticsProvider: FunctionComponent<AnalyticsProviderProps> = ({ children }) => {
  const { analyticsEnabled } = useSettings();
  const { pathname } = useLocation();

  const [clientId] = useLocalStorageState<string>('analyticsClientId', uuidv4());
  const sessionId = useMemo<string>(() => uuidv4(), []);

  const [eventsToSend, setEventsToSend] = useState<AnalyticsEvent[]>([]);

  const sendEventsState = useSendEvents();

  const sendEvents = useCallback((): void => {
    if (isEmpty(eventsToSend)) {
      return;
    }
    sendEventsState.mutate({
      apiSecret: GOOGLE_ANALYTICS_API_SECRET,
      clientId: clientId,
      measurementId: GOOGLE_ANALYTICS_MEASUREMENT_ID,
      sessionId: sessionId,
      events: eventsToSend,
    });
    setEventsToSend([]);
  }, [eventsToSend, setEventsToSend, clientId, sessionId]);

  useDebouncedEffect(sendEvents, [eventsToSend], 1000);

  const addEvents = useCallback(
    (events: AnalyticsEvent[]): void => {
      if (!analyticsEnabled) {
        return;
      }

      setEventsToSend((prev) => [...prev, ...events]);
    },
    [analyticsEnabled, setEventsToSend]
  );

  useEffect(() => {
    addEvents([{ name: 'app_open', params: {} }]);
  }, []);

  useEffect(() => {
    const urlInfo: UrlInfo | undefined = findLast(urls, (u) => !!matchPath({ path: u.url }, pathname));
    if (!urlInfo) {
      return;
    }
    addEvents([{ name: 'page_view', params: { page_title: urlInfo.path, page_location: pathname } }]);
  }, [pathname]);

  return (
    <AnalyticsContext.Provider
      value={{
        addEvents,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

const useAnalytics = (): AnalyticsContextProps => {
  const context = useContext(AnalyticsContext);

  if (!context) throw new Error('AnalyticsContext must be used inside AnalyticsProvider');

  return context;
};

export { AnalyticsContext, AnalyticsProvider, useAnalytics };
