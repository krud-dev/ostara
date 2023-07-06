import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import { AgentRO } from 'common/generated_definitions';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import AgentSidebar from 'renderer/layout/agent/components/AgentSidebar';
import LoadingPage from 'renderer/components/layout/LoadingPage';
import AgentUnhealthy from 'renderer/layout/agent/components/health/AgentUnhealthy';
import AgentPending from 'renderer/layout/agent/components/health/AgentPending';

const AgentLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<AgentRO | undefined>(() => selectedItem as AgentRO | undefined, [selectedItem]);

  const content = useMemo<ReactNode | undefined>(() => {
    if (!item) {
      return <LoadingPage />;
    }
    if (item.health.status === 'UNHEALTHY') {
      return <AgentUnhealthy item={item} />;
    }
    if (item.health.status === 'PENDING') {
      return <AgentPending item={item} />;
    }
    return undefined;
  }, [item]);

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={AgentSidebar} sidebarProps={{ item }} content={content} />;
};

export default AgentLayout;
