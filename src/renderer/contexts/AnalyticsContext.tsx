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
import { AMPLITUDE_API_KEY } from '../constants/ids';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { findLast } from 'lodash';
import { UrlInfo, urls } from '../routes/urls';
import * as amplitude from '@amplitude/analytics-browser';

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export type AnalyticsContextProps = {
  track: (event: AnalyticsEvent) => void;
};

const AnalyticsContext = React.createContext<AnalyticsContextProps>(undefined!);

interface AnalyticsProviderProps extends PropsWithChildren<any> {}

const AnalyticsProvider: FunctionComponent<AnalyticsProviderProps> = ({ children }) => {
  const { analyticsEnabled } = useSettings();
  const { pathname } = useLocation();

  const [initiated, setInitiated] = useState<boolean>(false);
  const [pendingEvents, setPendingEvents] = useState<AnalyticsEvent[]>([]);

  const [deviceId, setDeviceId] = useLocalStorageState<string | undefined>('analyticsDeviceId', undefined);
  const sessionId = useMemo<number>(() => Date.now(), []);

  useEffect(() => {
    if (initiated) {
      amplitude.setOptOut(!analyticsEnabled);
    } else if (analyticsEnabled) {
      (async () => {
        const initDeviceId = deviceId || uuidv4();
        if (initDeviceId !== deviceId) {
          setDeviceId(initDeviceId);
        }

        const appVersion = await window.ui.getAppVersion();

        await amplitude.init(AMPLITUDE_API_KEY, undefined, {
          appVersion: appVersion,
          sessionId: sessionId,
          deviceId: initDeviceId,
          disableCookies: true,
          trackingOptions: {
            ipAddress: false,
          },
        });
        setInitiated(true);
      })();
    }
  }, [analyticsEnabled]);

  const track = useCallback(
    (event: AnalyticsEvent): void => {
      if (!analyticsEnabled) {
        return;
      }
      if (!initiated) {
        setPendingEvents((prev) => [...prev, event]);
        return;
      }
      amplitude.track(event.name, event.properties);
    },
    [analyticsEnabled, initiated]
  );

  useEffect(() => {
    if (!analyticsEnabled) {
      return;
    }
    if (!initiated) {
      return;
    }
    pendingEvents.forEach((event) => {
      track(event);
    });
    setPendingEvents([]);
  }, [initiated]);

  useEffect(() => {
    const urlInfo: UrlInfo | undefined = findLast(urls, (u) => !!matchPath({ path: u.url }, pathname));
    if (!urlInfo) {
      return;
    }
    if (urlInfo.redirect) {
      return;
    }
    track({ name: 'page_view', properties: { page_title: urlInfo.path, page_location: pathname } });
  }, [pathname]);

  return (
    <AnalyticsContext.Provider
      value={{
        track,
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
