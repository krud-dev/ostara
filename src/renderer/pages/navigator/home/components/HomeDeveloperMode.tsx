import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { DOCUMENTATION_URL } from '../../../../constants/ui';
import NiceModal from '@ebay/nice-modal-react';
import {
  ApplicationModifyRequestRO,
  ApplicationRO,
  InstanceModifyRequestRO,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';
import { INHERITED_COLOR_VALUE } from '../../../../hooks/useItemColor';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { getActuatorUrls } from '../../../../utils/itemUtils';
import { instanceCrudEntity } from '../../../../apis/requests/crud/entity/entities/instance.crudEntity';
import { crudKeys } from '../../../../apis/requests/crud/crudKeys';
import { useCrudCreate } from '../../../../apis/requests/crud/crudCreate';
import { useCrudCreateBulk } from '../../../../apis/requests/crud/crudCreateBulk';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';

type HomeDeveloperModeProps = {};

export default function HomeDeveloperMode({}: HomeDeveloperModeProps) {
  const { getNewItemOrder } = useNavigatorTree();
  const queryClient = useQueryClient();

  const itemsToCreate = useMemo<{ applicationName: string; instances: string[] }[]>(
    () => [
      {
        applicationName: 'Flyway',
        instances: [
          'https://sbclient.krud.dev/first/1/actuator',
          'https://sbclient.krud.dev/first/2/actuator',
          'https://sbclient.krud.dev/first/3/actuator',
        ],
      },
      {
        applicationName: 'Liquibase',
        instances: [
          'https://sbclient.krud.dev/second/1/actuator',
          'https://sbclient.krud.dev/second/2/actuator',
          'https://sbclient.krud.dev/second/3/actuator',
        ],
      },
      {
        applicationName: 'Secure',
        instances: [
          'https://sbclient.krud.dev/third/1/actuator',
          'https://sbclient.krud.dev/third/2/actuator',
          'https://sbclient.krud.dev/third/3/actuator',
        ],
      },
    ],
    []
  );

  const [loading, setLoading] = useState<boolean>(false);

  const createApplicationState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>({ refetchNone: true });
  const createBulkInstanceState = useCrudCreateBulk<InstanceRO, InstanceModifyRequestRO>({ refetchNone: true });

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      let applicationSort = getNewItemOrder();
      for (const itemToCreate of itemsToCreate) {
        const applicationToCreate: ApplicationModifyRequestRO = {
          alias: itemToCreate.applicationName,
          type: 'SPRING_BOOT',
          parentFolderId: undefined,
          sort: applicationSort,
          color: INHERITED_COLOR_VALUE,
          authentication: { type: 'inherit' },
        };
        applicationSort += 1;

        const application = await createApplicationState.mutateAsync({
          entity: applicationCrudEntity,
          item: applicationToCreate,
        });

        const instanceSort = 1;
        const actuatorUrls = itemToCreate.instances;
        const instancesToCreate = actuatorUrls.map<InstanceModifyRequestRO>((actuatorUrl, index) => ({
          alias: undefined,
          actuatorUrl,
          parentApplicationId: application.id,
          sort: instanceSort + index,
          color: INHERITED_COLOR_VALUE,
          icon: undefined,
        }));

        await createBulkInstanceState.mutateAsync({
          entity: instanceCrudEntity,
          items: instancesToCreate,
        });
      }

      queryClient.invalidateQueries(crudKeys.entity(applicationCrudEntity));
      queryClient.invalidateQueries(crudKeys.entity(instanceCrudEntity));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [getNewItemOrder]);

  return (
    <Card sx={{ flexGrow: 1, minHeight: 300 }}>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          Developer Mode &#x1F913;
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          Electron: {JSON.stringify(window.isElectron)}
        </Typography>

        {itemsToCreate.map((itemToCreate) => (
          <Fragment key={itemToCreate.applicationName}>
            <Typography variant={'subtitle2'} sx={{ mt: 1 }}>
              {itemToCreate.applicationName}
            </Typography>
            {itemToCreate.instances.map((instance) => (
              <Typography variant={'body2'} sx={{ color: 'text.secondary' }} key={instance}>
                {instance}
              </Typography>
            ))}
          </Fragment>
        ))}

        <Typography variant={'subtitle2'} sx={{ mt: 1 }}>
          Daemon
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          {window.daemonAddress}/actuator
        </Typography>

        <Typography variant={'subtitle2'} sx={{ mt: 1 }}>
          Swagger API Documentation
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          http://localhost:12222/swagger-ui/index.html
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <LoadingButton variant="outlined" color="primary" loading={loading} onClick={createInstanceHandler}>
            Create Test Instances
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
