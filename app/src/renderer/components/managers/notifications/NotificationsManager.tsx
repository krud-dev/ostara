import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { NotificationInfo } from 'infra/notifications/models/notificationInfo';
import { useNavigate } from 'react-router-dom';
import { isNil } from 'lodash';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import { NotificationsGeneratorApplicationHealth } from 'renderer/components/managers/notifications/generators/NotificationsGeneratorApplicationHealth';
import { NotificationsGeneratorMetricRules } from 'renderer/components/managers/notifications/generators/NotificationsGeneratorMetricRules';
import { NotificationsGeneratorAgentHealth } from 'renderer/components/managers/notifications/generators/NotificationsGeneratorAgentHealth';

interface NotificationsManagerProps {}

const NotificationsManager: FunctionComponent<NotificationsManagerProps> = () => {
  const navigate = useNavigate();
  const { notificationsActive } = useSettingsContext();

  const subscribeToNotificationClickedState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToNotificationClickedState.mutateAsync({
        event: 'app:notificationClicked',
        listener: (event: IpcRendererEvent, info: NotificationInfo) => {
          if (info.url) {
            navigate(info.url);
          }
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  if (!notificationsActive) {
    return null;
  }

  return <NotificationsSender />;
};

export default NotificationsManager;

type NotificationsSenderProps = {};

const NotificationsSender: FunctionComponent<NotificationsSenderProps> = () => {
  const { notificationsActive, notificationsSoundActive } = useSettingsContext();

  const sendNotification = useCallback(
    async (notificationInfo: NotificationInfo): Promise<void> => {
      if (!notificationsActive) {
        return;
      }
      await window.notifications.sendNotification({
        ...notificationInfo,
        silent: isNil(notificationInfo.silent) ? !notificationsSoundActive : notificationInfo.silent,
      });
    },
    [notificationsActive, notificationsSoundActive]
  );

  return (
    <>
      <NotificationsGeneratorApplicationHealth sendNotification={sendNotification} />
      <NotificationsGeneratorAgentHealth sendNotification={sendNotification} />
      <NotificationsGeneratorMetricRules sendNotification={sendNotification} />
    </>
  );
};
