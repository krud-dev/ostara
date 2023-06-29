import React, { FunctionComponent, useMemo } from 'react';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import { AgentRO } from 'common/generated_definitions';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import AgentSidebar from 'renderer/layout/agent/components/AgentSidebar';

const AgentLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<AgentRO | undefined>(() => selectedItem as AgentRO | undefined, [selectedItem]);

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={AgentSidebar} sidebarProps={{ item }} />;
};

export default AgentLayout;
