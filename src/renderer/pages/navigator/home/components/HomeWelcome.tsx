import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { InstanceRO } from '../../../../../common/generated_definitions';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';

type HomeWelcomeProps = {};

export default function HomeWelcome({}: HomeWelcomeProps) {
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
          Welcome to Boost! &#x1F495;
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          Get started by adding your first Spring Boot actuator instance. Monitor and manage your Spring Boot
          applications with ease. Enjoy!
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="primary" onClick={createInstanceHandler}>
            <FormattedMessage id={'createInstance'} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
