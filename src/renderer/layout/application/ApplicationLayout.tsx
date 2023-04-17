import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import ApplicationSidebar from 'renderer/layout/application/components/ApplicationSidebar';
import { ApplicationRO } from '../../../common/generated_definitions';

const ApplicationLayout: FunctionComponent = () => {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();

  const item = useMemo<ApplicationRO | undefined>(() => selectedItem as ApplicationRO | undefined, [selectedItem]);

  if (!item) {
    return null;
  }

  return (
    <SecondarySidebarLayout
      Sidebar={ApplicationSidebar}
      sidebarProps={{ item, itemAbilities: selectedItemAbilities }}
    />
  );
};

export default ApplicationLayout;
