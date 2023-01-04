import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedApplication } from 'infra/configuration/model/configuration';
import { Widget } from 'infra/dashboard/model';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

const ApplicationDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedApplication | undefined>(
    () => selectedItem as EnrichedApplication | undefined,
    [selectedItem]
  );

  const widgets = useMemo<Widget[]>(() => [], []);

  if (!item) {
    return null;
  }

  return (
    <Page sx={{ width: '100%', p: COMPONENTS_SPACING }}>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {`Application ${item.id}`}
        {widgets.map((widget) => (
          <DashboardWidget widget={widget} item={item} intervalSeconds={10} key={widget.id} />
        ))}
      </Stack>
    </Page>
  );
};

export default ApplicationDashboard;
