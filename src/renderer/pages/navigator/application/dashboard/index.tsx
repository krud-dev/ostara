import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import DashboardWidget from 'renderer/components/widget/DashboardWidget';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { Widget } from '../../../../components/widget/widget';
import { ApplicationRO } from '../../../../../common/generated_definitions';

const ApplicationDashboard: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<ApplicationRO | undefined>(() => selectedItem as ApplicationRO | undefined, [selectedItem]);

  const widgets = useMemo<Widget[]>(() => [], []);

  if (!item) {
    return null;
  }

  return (
    <Page>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {`Application ${item.id}`}
        {widgets.map((widget) => (
          <DashboardWidget widget={widget} item={item} key={widget.id} />
        ))}
      </Stack>
    </Page>
  );
};

export default ApplicationDashboard;
