import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { NotificationInfo } from 'infra/notifications/models/notificationInfo';
import { generatePath } from 'react-router-dom';
import {
  AgentHealthDTO,
  AgentHealthDTO$Companion$Status,
  AgentHealthUpdatedEventMessage$Payload,
  AgentRO,
} from 'common/generated_definitions';
import { useStompContext } from 'renderer/apis/websockets/StompContext';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { usePrevious } from 'react-use';
import { urls } from 'renderer/routes/urls';
import { useIntl } from 'react-intl';
import { getItemDisplayName } from 'renderer/utils/itemUtils';
import { NotificationsGeneratorProps } from 'renderer/components/managers/notifications/generators/types';

export const NotificationsGeneratorAgentHealth: FunctionComponent<NotificationsGeneratorProps> = ({
  sendNotification,
}) => {
  const { agents } = useItemsContext();
  const { subscribe } = useStompContext();
  const intl = useIntl();

  const previousAgents = usePrevious(agents);

  const [healthUpdatedEvent, setHealthUpdatedEvent] = useState<AgentHealthUpdatedEventMessage$Payload | undefined>(
    undefined
  );

  const getNotificationInfo = useCallback((agent: AgentRO, newHealth: AgentHealthDTO): NotificationInfo | undefined => {
    const agentName = getItemDisplayName(agent);
    const agentUrl = generatePath(urls.agent.url, { id: agent.id });

    switch (newHealth.status) {
      case 'HEALTHY':
        return {
          title: intl.formatMessage({ id: 'notificationTitleAgentHealthy' }, { application: agentName }),
          body: intl.formatMessage({ id: 'notificationBodyAgentHealthy' }, { application: agentName }),
          url: agentUrl,
        };
      case 'UNHEALTHY':
        return {
          title: intl.formatMessage({ id: 'notificationTitleAgentUnhealthy' }, { application: agentName }),
          body: intl.formatMessage({ id: 'notificationBodyAgentUnhealthy' }, { application: agentName }),
          url: agentUrl,
        };
      default:
        return undefined;
    }
  }, []);

  useEffect(() => {
    if (!healthUpdatedEvent) {
      return;
    }

    const agent = previousAgents?.find((a) => a.id === healthUpdatedEvent.agentId);
    if (!agent) {
      return;
    }

    const notificationStatuses: AgentHealthDTO$Companion$Status[] = ['UNHEALTHY', 'HEALTHY'];
    if (
      notificationStatuses.includes(agent.health.status) &&
      notificationStatuses.includes(healthUpdatedEvent.newHealth.status) &&
      agent.health.status !== healthUpdatedEvent.newHealth.status
    ) {
      const notificationInfo = getNotificationInfo(agent, healthUpdatedEvent.newHealth);
      if (notificationInfo) {
        sendNotification(notificationInfo);
      }
    }
  }, [healthUpdatedEvent, previousAgents]);

  useEffect(() => {
    const unsubscribe = subscribe('/topic/agentHealth', {}, (healthChanged: AgentHealthUpdatedEventMessage$Payload) => {
      setHealthUpdatedEvent(healthChanged);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};
