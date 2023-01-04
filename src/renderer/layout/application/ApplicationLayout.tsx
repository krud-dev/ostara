import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedApplication } from 'infra/configuration/model/configuration';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import ApplicationSidebar from 'renderer/layout/application/components/ApplicationSidebar';

const ApplicationLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedApplication | undefined>(
    () => selectedItem as EnrichedApplication | undefined,
    [selectedItem]
  );

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={ApplicationSidebar} sidebarProps={{ item }} />;
};

export default ApplicationLayout;
