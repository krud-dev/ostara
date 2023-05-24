import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSubscribeToEvent } from '../../apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { NotificationInfo } from '../../../infra/notifications/models/notificationInfo';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  ApplicationHealthRO,
  ApplicationHealthStatus,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
} from '../../../common/generated_definitions';
import { useStomp } from '../../apis/websockets/StompContext';
import { useItems } from '../../contexts/ItemsContext';
import { usePrevious } from 'react-use';
import { urls } from '../../routes/urls';
import { useIntl } from 'react-intl';
import { getItemDisplayName } from '../../utils/itemUtils';

interface NotificationsManagerProps {}

const NotificationsManager: FunctionComponent<NotificationsManagerProps> = () => {
  const navigate = useNavigate();

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

  return <NotificationsSender />;
};

export default NotificationsManager;

interface NotificationsSenderProps {}

const NotificationsSender: FunctionComponent<NotificationsSenderProps> = () => {
  const { applications, getItem } = useItems();
  const { subscribe } = useStomp();
  const intl = useIntl();

  const previousApplications = usePrevious(applications);

  const [healthUpdatedEvent, setHealthUpdatedEvent] = useState<
    ApplicationHealthUpdatedEventMessage$Payload | undefined
  >(undefined);

  const getApplicationHealthNotificationInfo = useCallback(
    (application: ApplicationRO, newHealth: ApplicationHealthRO): NotificationInfo | undefined => {
      switch (newHealth.status) {
        case 'ALL_UP':
          return {
            title: intl.formatMessage(
              {
                id: 'notificationTitleApplicationAllUp',
              },
              { application: getItemDisplayName(application) }
            ),
            body: intl.formatMessage(
              {
                id: 'notificationBodyApplicationAllUp',
              },
              { application: getItemDisplayName(application) }
            ),
            url: generatePath(urls.application.url, { id: application.id }),
          };
        case 'ALL_DOWN':
          return {
            title: intl.formatMessage(
              {
                id: 'notificationTitleApplicationAllDown',
              },
              { application: getItemDisplayName(application) }
            ),
            body: intl.formatMessage(
              {
                id: 'notificationBodyApplicationAllDown',
              },
              { application: getItemDisplayName(application) }
            ),
            url: generatePath(urls.application.url, { id: application.id }),
          };
        case 'SOME_DOWN':
          return {
            title: intl.formatMessage(
              {
                id:
                  application.health.status === 'ALL_UP'
                    ? 'notificationTitleApplicationPartiallyDown'
                    : 'notificationTitleApplicationPartiallyUp',
              },
              { application: getItemDisplayName(application) }
            ),
            body: intl.formatMessage(
              {
                id:
                  application.health.status === 'ALL_UP'
                    ? 'notificationBodyApplicationPartiallyDown'
                    : 'notificationBodyApplicationPartiallyUp',
              },
              { application: getItemDisplayName(application) }
            ),
            url: generatePath(urls.application.url, { id: application.id }),
          };
        default:
          return undefined;
      }
    },
    []
  );

  useEffect(() => {
    if (!healthUpdatedEvent) {
      return;
    }

    const application = previousApplications?.find((a) => a.id === healthUpdatedEvent.applicationId);
    if (!application) {
      return;
    }

    const notificationStatuses: ApplicationHealthStatus[] = ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN'];
    if (
      notificationStatuses.includes(application.health.status) &&
      notificationStatuses.includes(healthUpdatedEvent.newHealth.status) &&
      application.health.status !== healthUpdatedEvent.newHealth.status
    ) {
      const notificationInfo = getApplicationHealthNotificationInfo(application, healthUpdatedEvent.newHealth);
      if (notificationInfo) {
        window.notifications.sendNotification(notificationInfo);
      }
    }
  }, [healthUpdatedEvent]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationHealth',
      {},
      (healthChanged: ApplicationHealthUpdatedEventMessage$Payload) => {
        setHealthUpdatedEvent(healthChanged);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};
