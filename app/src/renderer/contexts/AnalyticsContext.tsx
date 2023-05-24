import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSettings } from './SettingsContext';
import { AMPLITUDE_API_KEY } from '../constants/ids';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import * as amplitude from '@amplitude/analytics-browser';

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export type AnalyticsContextProps = {
  analyticsActive: boolean;
  track: (event: AnalyticsEvent) => void;
};

const AnalyticsContext = React.createContext<AnalyticsContextProps>(undefined!);

interface AnalyticsProviderProps extends PropsWithChildren<any> {}

const AnalyticsProvider: FunctionComponent<AnalyticsProviderProps> = ({ children }) => {
  const { analyticsEnabled, developerMode } = useSettings();

  const [initiated, setInitiated] = useState<boolean>(false);
  const [pendingEvents, setPendingEvents] = useState<AnalyticsEvent[]>([]);

  const analyticsActive = useMemo(() => analyticsEnabled && !developerMode, [analyticsEnabled, developerMode]);
  const [deviceId, setDeviceId] = useLocalStorageState<string | undefined>('analyticsDeviceId', undefined);
  const sessionId = useMemo<number>(() => Date.now(), []);

  useEffect(() => {
    if (initiated) {
      amplitude.setOptOut(!analyticsActive);
    } else if (analyticsActive) {
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
  }, [analyticsActive]);

  const track = useCallback(
    (event: AnalyticsEvent): void => {
      if (!analyticsActive) {
        return;
      }
      if (!initiated) {
        setPendingEvents((prev) => [...prev, event]);
        return;
      }
      amplitude.track(event.name, event.properties);
    },
    [analyticsActive, initiated]
  );

  useEffect(() => {
    if (!analyticsActive) {
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

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsActive,
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
