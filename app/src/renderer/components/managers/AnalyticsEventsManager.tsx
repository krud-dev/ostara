import React, { FunctionComponent, useEffect, useState } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { UrlInfo, urls } from '../../routes/urls';
import { findLast } from 'lodash';
import { matchPath, useLocation } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useSubscribeToEvent } from '../../apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { UpdateInfo } from 'electron-updater';
import { getErrorMessage } from '../../utils/errorUtils';

interface AnalyticsEventsManagerProps {}

const AnalyticsEventsManager: FunctionComponent<AnalyticsEventsManagerProps> = () => {
  const { analyticsActive } = useAnalytics();

  if (!analyticsActive) {
    return null;
  }

  return <AnalyticsEventsSender />;
};

export default AnalyticsEventsManager;

interface AnalyticsEventsSenderProps {}

const AnalyticsEventsSender: FunctionComponent<AnalyticsEventsSenderProps> = () => {
  const { track } = useAnalytics();
  const { pathname } = useLocation();
  const { daemonHealthy } = useSettings();

  const [heartbeatFlag, setHeartbeatFlag] = useState<boolean>(false);

  useEffect(() => {
    track({ name: 'heartbeat' });
  }, [heartbeatFlag]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeatFlag((prev) => !prev);
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (!daemonHealthy) {
      track({ name: 'daemon_unhealthy' });
    }
  }, [daemonHealthy]);

  const subscribeToEventsState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:checkingForUpdate',
        listener: (event: IpcRendererEvent) => {
          track({ name: 'app_checking_for_update' });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:updateAvailable',
        listener: (event: IpcRendererEvent, data: UpdateInfo) => {
          track({ name: 'app_update_available', properties: { version: data.version } });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:updateNotAvailable',
        listener: (event: IpcRendererEvent, data: UpdateInfo) => {
          track({ name: 'app_update_not_available', properties: { version: data.version } });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:updateDownloaded',
        listener: (event: IpcRendererEvent, data: UpdateInfo) => {
          track({ name: 'app_update_downloaded', properties: { version: data.version } });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:updateCancelled',
        listener: (event: IpcRendererEvent, data: UpdateInfo) => {
          track({ name: 'app_update_cancelled', properties: { version: data.version } });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToEventsState.mutateAsync({
        event: 'app:updateError',
        listener: (event: IpcRendererEvent, data: Error) => {
          track({ name: 'app_update_error', properties: { error: getErrorMessage(data) } });
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  return null;
};
