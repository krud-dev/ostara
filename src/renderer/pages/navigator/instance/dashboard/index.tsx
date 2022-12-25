import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Instance } from 'infra/configuration/model/configuration';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<Instance | undefined>(() => selectedItem as Instance | undefined, [selectedItem]);

  if (!item) {
    return null;
  }

  return <Page sx={{ width: '100%', height: '100%' }}>{`Instance ${item.alias}`}</Page>;
};

export default InstanceDashboard;
