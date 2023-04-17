import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from '../../../../../common/generated_definitions';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';
import { DOCUMENTATION_URL } from '../../../../constants/ui';

type HomeGettingStartedProps = {};

export default function HomeGettingStarted({}: HomeGettingStartedProps) {
  const { getNewItemOrder } = useNavigatorTree();

  const createInstanceHandler = useCallback((): void => {
    NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      sort: getNewItemOrder(),
    });
  }, [getNewItemOrder]);

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

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="primary" onClick={createInstanceHandler}>
            <FormattedMessage id={'createInstance'} />
          </Button>
          <Button variant="outlined" color="primary" href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
            <FormattedMessage id={'openDocumentation'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
