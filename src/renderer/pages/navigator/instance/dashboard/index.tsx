import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { values } from 'lodash';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { Widget } from '../../../../components/widget/widget';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { springBootWidgets } from './constants/widgets';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const widgets = useMemo<Widget[]>(() => values(springBootWidgets), []);

  return (
    <Page key={item.dataCollectionIntervalSeconds}>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {widgets.map((widget) => (
          <DashboardWidget
            widget={widget}
            item={item}
            intervalSeconds={item.dataCollectionIntervalSeconds}
            key={widget.id}
          />
        ))}
      </Stack>
    </Page>
  );
};

export default InstanceDashboard;
