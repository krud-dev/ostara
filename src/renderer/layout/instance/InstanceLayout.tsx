import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import InstanceSidebar from 'renderer/layout/instance/components/InstanceSidebar';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';

const InstanceLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={InstanceSidebar} sidebarProps={{ item }} />;
};

export default InstanceLayout;
