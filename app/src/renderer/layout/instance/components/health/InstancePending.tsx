import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { useMemo } from 'react';
import { getInstanceHealthStatusIcon, getItemHealthStatusColor } from 'renderer/utils/itemUtils';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from '../../../../../common/generated_definitions';
import useItemDisplayName from '../../../../hooks/useItemDisplayName';

type InstancePendingProps = {
  item: InstanceRO;
};

export default function InstancePending({ item }: InstancePendingProps) {
  const displayName = useItemDisplayName(item);
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);
  const healthStatusIcon = useMemo<MUIconType>(() => getInstanceHealthStatusIcon(item.health.status), [item]);

  return (
    <Page sx={{ height: '100%' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <IconViewer icon={healthStatusIcon} sx={{ color: healthStatusColor, fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'instanceAliasPending'} values={{ alias: displayName }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'dataAvailableWhenConnection'} />
          </Typography>

          <CircularProgress sx={{ my: 3 }} />
        </CardContent>
      </Card>
    </Page>
  );
}
