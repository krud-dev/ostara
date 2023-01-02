import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import { springBootWidgets } from 'infra/dashboard/widgets';
import { Widget } from 'infra/dashboard/model';
import { values } from 'lodash';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

const InstanceDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );

  const widgets = useMemo<Widget[]>(() => values(springBootWidgets), []);

  if (!item) {
    return null;
  }

  return (
    <Page sx={{ width: '100%', p: COMPONENTS_SPACING }}>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {widgets.map((widget) => (
          <DashboardWidget widget={widget} item={item} key={widget.id} />
        ))}
      </Stack>
    </Page>
  );
};

export default InstanceDashboard;
