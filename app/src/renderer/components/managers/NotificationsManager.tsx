import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSubscribeToEvent } from 'renderer/apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { NotificationInfo } from 'infra/notifications/models/notificationInfo';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  ApplicationHealthRO,
  ApplicationHealthStatus,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationMetricRuleOperation,
  ApplicationMetricRuleTriggeredMessage$Payload,
  ApplicationRO,
} from 'common/generated_definitions';
import { useStomp } from '../../apis/websockets/StompContext';
import { useItemsContext } from '../../contexts/ItemsContext';
import { usePrevious } from 'react-use';
import { urls } from '../../routes/urls';
import { useIntl } from 'react-intl';
import { getItemDisplayName } from '../../utils/itemUtils';
import { getMetricFullName } from '../../utils/metricUtils';
import { isNil } from 'lodash';
import { useSettingsContext } from '../../contexts/SettingsContext';

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

interface NotificationsSenderProps {}

const NotificationsSender: FunctionComponent<NotificationsSenderProps> = () => {
  const { notificationsActive, notificationsSoundActive } = useSettingsContext();
  const { applications, instances } = useItemsContext();
  const { subscribe } = useStomp();
  const intl = useIntl();

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

  const previousApplications = usePrevious(applications);

  const [healthUpdatedEvent, setHealthUpdatedEvent] = useState<
    ApplicationHealthUpdatedEventMessage$Payload | undefined
  >(undefined);

  const getApplicationHealthNotificationInfo = useCallback(
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

  const [metricRuleEvent, setMetricRuleEvent] = useState<ApplicationMetricRuleTriggeredMessage$Payload | undefined>(
    undefined
  );

  const getMetricRuleNotificationBodyMessageId = useCallback(
    (operation?: ApplicationMetricRuleOperation): string | undefined => {
      switch (operation) {
        case 'GREATER_THAN':
          return 'notificationBodyApplicationMetricRuleGreaterThan';
        case 'LOWER_THAN':
          return 'notificationBodyApplicationMetricRuleLowerThan';
        case 'BETWEEN':
          return 'notificationBodyApplicationMetricRuleBetween';
        default:
          return undefined;
      }
    },
    []
  );

  const getMetricRuleNotificationInfo = useCallback(
    (
      application: ApplicationRO,
      metricRuleTriggered: ApplicationMetricRuleTriggeredMessage$Payload
    ): NotificationInfo | undefined => {
      const applicationName = getItemDisplayName(application);
      const applicationUrl = generatePath(urls.application.url, { id: application.id });
      const instanceNames = metricRuleTriggered.instanceIdsAndValues
        .map((i) => i.instanceId)
        .map((instanceId) => instances?.find((i) => i.id === instanceId))
        .map((instance) => (instance ? getItemDisplayName(instance) : intl.formatMessage({ id: 'unknownInstance' })))
        .join(', ');
      const metricRuleName = metricRuleTriggered.applicationMetricRule.name;
      const values = metricRuleTriggered.instanceIdsAndValues.map((i) => Math.round(i.value * 100) / 100).join(', ');
      let metricName = getMetricFullName(metricRuleTriggered.applicationMetricRule.metricName, { hideTags: true });
      if (
        metricRuleTriggered.applicationMetricRule.type === 'RELATIVE' &&
        metricRuleTriggered.applicationMetricRule.divisorMetricName
      ) {
        metricName += ` / ${getMetricFullName(metricRuleTriggered.applicationMetricRule.divisorMetricName, {
          hideTags: true,
        })}`;
      }
      const value = metricRuleTriggered.applicationMetricRule.value1.toString();
      const value2 = metricRuleTriggered.applicationMetricRule.value2?.toString() || '';

      const bodyMessageId = getMetricRuleNotificationBodyMessageId(metricRuleTriggered.applicationMetricRule.operation);
      if (!bodyMessageId) {
        return undefined;
      }

      return {
        title: intl.formatMessage(
          { id: 'notificationTitleApplicationMetricRule' },
          { application: applicationName, metricRule: metricRuleName }
        ),
        body: intl.formatMessage(
          { id: bodyMessageId },
          {
            instances: instanceNames,
            metric: metricName,
            values: values,
            value: value,
            value2: value2,
          }
        ),
        url: applicationUrl,
      };
    },
    [instances]
  );

  useEffect(() => {
    if (!metricRuleEvent) {
      return;
    }

    const application = applications?.find((a) => a.id === metricRuleEvent.applicationMetricRule.applicationId);
    if (!application) {
      return;
    }

    const notificationInfo = getMetricRuleNotificationInfo(application, metricRuleEvent);
    if (notificationInfo) {
      sendNotification(notificationInfo);
    }
  }, [metricRuleEvent]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationMetricRuleTriggers',
      {},
      (metricRuleTriggered: ApplicationMetricRuleTriggeredMessage$Payload) => {
        setMetricRuleEvent(metricRuleTriggered);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};
