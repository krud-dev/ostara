import { Button, Card, CardContent, CardHeader, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import Page from 'renderer/components/layout/Page';
import React, { useCallback, useMemo } from 'react';
import { getItemHealthStatusColor } from 'renderer/utils/itemUtils';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import FormattedDateAndRelativeTime from 'renderer/components/time/FormattedDateAndRelativeTime';

type InstancePendingProps = {
  item: EnrichedInstance;
};

export default function InstancePending({ item }: InstancePendingProps) {
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);

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
          <IconViewer icon={'HourglassEmptyOutlined'} sx={{ color: healthStatusColor, fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'instanceAliasPending'} values={{ alias: item.alias }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'dataAvailableWhenConnection'} />
          </Typography>

          <CircularProgress sx={{ mt: 3 }} />
        </CardContent>
      </Card>
    </Page>
  );
}
