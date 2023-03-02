import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import SecondarySidebarLayout from 'renderer/layout/common/secondary-sidebar/SecondarySidebarLayout';
import { FolderRO } from '../../../common/generated_definitions';
import FolderSidebar from './components/FolderSidebar';

const FolderLayout: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<FolderRO | undefined>(() => selectedItem as FolderRO | undefined, [selectedItem]);

  if (!item) {
    return null;
  }

  return <SecondarySidebarLayout Sidebar={FolderSidebar} sidebarProps={{ item }} />;
};

export default FolderLayout;
