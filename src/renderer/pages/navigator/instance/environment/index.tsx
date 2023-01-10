import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import { Stack } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

const InstanceEnvironment: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance | undefined>(
    () => selectedItem as EnrichedInstance | undefined,
    [selectedItem]
  );

  if (!item) {
    return null;
  }

  return (
    <Page>
      <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
        {'Environment'}
      </Stack>
    </Page>
  );
};

export default InstanceEnvironment;
