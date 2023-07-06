import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { NotificationInfo } from 'infra/notifications/models/notificationInfo';
import { generatePath } from 'react-router-dom';
import {
  ApplicationMetricRuleOperation,
  ApplicationMetricRuleTriggeredMessage$Payload,
  ApplicationRO,
} from 'common/generated_definitions';
import { useStompContext } from 'renderer/apis/websockets/StompContext';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { urls } from 'renderer/routes/urls';
import { useIntl } from 'react-intl';
import { getItemDisplayName } from 'renderer/utils/itemUtils';
import { getMetricFullName } from 'renderer/utils/metricUtils';
import { NotificationsGeneratorProps } from 'renderer/components/managers/notifications/generators/types';

export const NotificationsGeneratorMetricRules: FunctionComponent<NotificationsGeneratorProps> = ({
  sendNotification,
}) => {
  const { applications, instances } = useItemsContext();
  const { subscribe } = useStompContext();
  const intl = useIntl();

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

  const getNotificationInfo = useCallback(
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

    const notificationInfo = getNotificationInfo(application, metricRuleEvent);
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
