import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { NotificationInfo } from 'infra/notifications/models/notificationInfo';
import { generatePath } from 'react-router-dom';
import {
  ApplicationHealthRO,
  ApplicationHealthStatus,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
} from 'common/generated_definitions';
import { useStompContext } from 'renderer/apis/websockets/StompContext';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { usePrevious } from 'react-use';
import { urls } from 'renderer/routes/urls';
import { useIntl } from 'react-intl';
import { getItemDisplayName } from 'renderer/utils/itemUtils';
import { NotificationsGeneratorProps } from 'renderer/components/managers/notifications/generators/types';

export const NotificationsGeneratorApplicationHealth: FunctionComponent<NotificationsGeneratorProps> = ({
  sendNotification,
}) => {
  const { applications } = useItemsContext();
  const { subscribe } = useStompContext();
  const intl = useIntl();

  const previousApplications = usePrevious(applications);

  const [healthUpdatedEvent, setHealthUpdatedEvent] = useState<
    ApplicationHealthUpdatedEventMessage$Payload | undefined
  >(undefined);

  const getNotificationInfo = useCallback(
    (application: ApplicationRO, newHealth: ApplicationHealthRO): NotificationInfo | undefined => {
      const applicationName = getItemDisplayName(application);
      const applicationUrl = generatePath(urls.application.url, { id: application.id });

      switch (newHealth.status) {
        case 'ALL_UP':
          return {
            title: intl.formatMessage({ id: 'notificationTitleApplicationAllUp' }, { application: applicationName }),
            body: intl.formatMessage({ id: 'notificationBodyApplicationAllUp' }, { application: applicationName }),
            url: applicationUrl,
          };
        case 'ALL_DOWN':
          return {
            title: intl.formatMessage({ id: 'notificationTitleApplicationAllDown' }, { application: applicationName }),
            body: intl.formatMessage({ id: 'notificationBodyApplicationAllDown' }, { application: applicationName }),
            url: applicationUrl,
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
              { application: applicationName }
            ),
            body: intl.formatMessage(
              {
                id:
                  application.health.status === 'ALL_UP'
                    ? 'notificationBodyApplicationPartiallyDown'
                    : 'notificationBodyApplicationPartiallyUp',
              },
              { application: applicationName }
            ),
            url: applicationUrl,
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

    const previousApplication = previousApplications?.find((a) => a.id === healthUpdatedEvent.applicationId);
    if (!previousApplication) {
      return;
    }

    const notificationStatuses: ApplicationHealthStatus[] = ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN'];
    if (
      notificationStatuses.includes(previousApplication.health.status) &&
      notificationStatuses.includes(healthUpdatedEvent.newHealth.status) &&
      previousApplication.health.status !== healthUpdatedEvent.newHealth.status
    ) {
      const notificationInfo = getNotificationInfo(previousApplication, healthUpdatedEvent.newHealth);
      if (notificationInfo) {
        sendNotification(notificationInfo);
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
