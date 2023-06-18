import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from 'common/generated_definitions';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import useStartDemo from 'renderer/hooks/demo/useStartDemo';
import { LoadingButton } from '@mui/lab';

type HomeGettingStartedProps = {};

export default function HomeGettingStarted({}: HomeGettingStartedProps) {
  const { getNewItemOrder } = useNavigatorLayout();

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      sort: getNewItemOrder(),
    });
  }, [getNewItemOrder]);

  const { startDemo, loading } = useStartDemo();

  return (
    <Card>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          <FormattedMessage id={'gettingStarted'} /> &#x1F680;
        </Typography>

        <Typography variant={'body2'} gutterBottom sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'alreadyHaveInstanceAddIt'} />
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
          <FormattedMessage id={'gettingStartedSteps'} />
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={createInstanceHandler}>
            <FormattedMessage id={'createInstance'} />
          </Button>
          <LoadingButton variant="outlined" color="info" onClick={startDemo} loading={loading}>
            <FormattedMessage id={'startDemoInstance'} />
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
