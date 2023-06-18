import React, { FunctionComponent, useMemo } from 'react';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import { FolderRO } from 'common/generated_definitions';
import FolderSidebar from 'renderer/layout/folder/components/FolderSidebar';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

const FolderLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<FolderRO | undefined>(() => selectedItem as FolderRO | undefined, [selectedItem]);

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={FolderSidebar} sidebarProps={{ item }} />;
};

export default FolderLayout;
