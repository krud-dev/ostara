import { Card, CardContent, Stack, Typography } from '@mui/material';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  ApplicationMetricRuleCreateRequestRO,
  ApplicationModifyRequestRO,
  ApplicationRO,
  FolderModifyRequestRO,
  FolderRO,
  InstanceModifyRequestRO,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';
import { INHERITED_COLOR_VALUE } from '../../../../hooks/useItemColor';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { instanceCrudEntity } from '../../../../apis/requests/crud/entity/entities/instance.crudEntity';
import { crudKeys } from '../../../../apis/requests/crud/crudKeys';
import { useCrudCreate } from '../../../../apis/requests/crud/crudCreate';
import { useCrudCreateBulk } from '../../../../apis/requests/crud/crudCreateBulk';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { Authentication$Typed } from '../../../../../common/manual_definitions';
import { useGetApplicationsHealth } from '../../../../apis/requests/application/health/getApplicationsHealth';
import { useDeleteItem } from '../../../../apis/requests/item/deleteItem';
import { folderCrudEntity } from '../../../../apis/requests/crud/entity/entities/folder.crudEntity';
import { showDeleteConfirmationDialog } from '../../../../utils/dialogUtils';
import { isItemDeletable } from '../../../../utils/itemUtils';
import { useCreateApplicationMetricRule } from '../../../../apis/requests/application/metric-rules/createApplicationMetricRule';

type ApplicationToCreate = {
  folderName?: string;
  applicationName: string;
  instances: string[];
  authentication?: Authentication$Typed;
  metricRule?: Omit<ApplicationMetricRuleCreateRequestRO, 'applicationId'>;
};

type HomeDeveloperModeProps = {};

export default function HomeDeveloperMode({}: HomeDeveloperModeProps) {
  const { data, getNewItemOrder } = useNavigatorTree();
  const queryClient = useQueryClient();

  const testApplications = useMemo<ApplicationToCreate[]>(
    () => [
      {
        folderName: 'Flyway',
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
        metricRule: {
          name: 'CPU usage > 90%',
          metricName: {
            name: 'process.cpu.usage',
            statistic: 'VALUE',
            tags: {},
          },
          type: 'SIMPLE',
          operation: 'GREATER_THAN',
          value1: 0.9,
          enabled: true,
        },
      },
      {
        applicationName: 'Secure',
        instances: [
          'https://sbclient.krud.dev/third/1/actuator',
          'https://sbclient.krud.dev/third/2/actuator',
          'https://sbclient.krud.dev/third/3/actuator',
        ],
        authentication: {
          type: 'basic',
          username: 'user',
          password: 'user',
        },
      },
      {
        applicationName: 'Daemon',
        instances: [`${window.daemonAddress}/actuator`],
      },
    ],
    []
  );

  const [loading, setLoading] = useState<boolean>(false);

  const createFolderState = useCrudCreate<FolderRO, FolderModifyRequestRO>({ refetchNone: true });
  const createApplicationState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>({ refetchNone: true });
  const createBulkInstanceState = useCrudCreateBulk<InstanceRO, InstanceModifyRequestRO>({ refetchNone: true });
  const createMetricRuleState = useCreateApplicationMetricRule();

  const createApplicationsHandler = useCallback(
    async (itemsToCreate: ApplicationToCreate[]): Promise<void> => {
      setLoading(true);

      try {
        let itemSort = getNewItemOrder();
        for (const itemToCreate of itemsToCreate) {
          const folder = itemToCreate.folderName
            ? await createFolderState.mutateAsync({
                entity: folderCrudEntity,
                item: {
                  alias: itemToCreate.folderName,
                  color: INHERITED_COLOR_VALUE,
                  authentication: { type: 'inherit' },
                  sort: itemSort,
                },
              })
            : undefined;

          const applicationToCreate: ApplicationModifyRequestRO = {
            alias: itemToCreate.applicationName,
            type: 'SPRING_BOOT',
            parentFolderId: folder?.id,
            sort: itemSort,
            color: INHERITED_COLOR_VALUE,
            authentication: itemToCreate.authentication ?? { type: 'inherit' },
          };

          itemSort += 1;

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

          if (itemToCreate.metricRule) {
            await createMetricRuleState.mutateAsync({
              metricRule: { ...itemToCreate.metricRule, applicationId: application.id },
            });
          }
        }

        queryClient.invalidateQueries(crudKeys.entity(folderCrudEntity));
        queryClient.invalidateQueries(crudKeys.entity(applicationCrudEntity));
        queryClient.invalidateQueries(crudKeys.entity(instanceCrudEntity));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [getNewItemOrder]
  );

  const createTestInstancesHandler = useCallback(async (): Promise<void> => {
    await createApplicationsHandler(testApplications);
  }, [createApplicationsHandler, testApplications]);

  const createManyInstancesHandler = useCallback(async (): Promise<void> => {
    await createApplicationsHandler([
      {
        applicationName: 'Many',
        instances: [
          'https://sbclient.krud.dev/first/1/actuator',
          'https://sbclient.krud.dev/first/2/actuator',
          'https://sbclient.krud.dev/first/3/actuator',
        ].flatMap((el) => new Array(66).fill(el)),
      },
    ]);
  }, [createApplicationsHandler, testApplications]);

  const deleteItemState = useDeleteItem({ refetchNone: true });

  const deleteAllHandler = useCallback(async (): Promise<void> => {
    if (!data) {
      return;
    }

    const confirm = await showDeleteConfirmationDialog(data);
    if (!confirm) {
      return;
    }

    setLoading(true);

    try {
      const promises = data
        .filter((item) => isItemDeletable(item))
        .map((itemToDelete) =>
          deleteItemState.mutateAsync({
            item: itemToDelete,
          })
        );
      const result = await Promise.all(promises);
      if (result) {
        queryClient.invalidateQueries(crudKeys.entity(folderCrudEntity));
        queryClient.invalidateQueries(crudKeys.entity(applicationCrudEntity));
        queryClient.invalidateQueries(crudKeys.entity(instanceCrudEntity));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [data, deleteItemState]);

  const applicationsHealthState = useGetApplicationsHealth();

  const logApplicationsHealthHandler = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const result = await applicationsHealthState.mutateAsync({});
      console.log('Applications Health', result);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [applicationsHealthState]);

  const sendTestNotificationHandler = useCallback(async (): Promise<void> => {
    await window.notifications.sendNotification({
      title: 'Test Notification Title',
      body: 'Test notification body text',
    });
  }, []);

  return (
    <Card sx={{ flexGrow: 1, minHeight: 300 }}>
      <CardContent>
        <Typography variant={'h6'} gutterBottom>
          Developer Mode &#x1F913;
        </Typography>

        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          Electron: {JSON.stringify(window.isElectron)}
        </Typography>

        {testApplications.map((itemToCreate) => (
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
          Swagger API Documentation
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          http://localhost:12222/swagger-ui/index.html
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <LoadingButton variant="outlined" color="primary" loading={loading} onClick={createTestInstancesHandler}>
            Create Test Instances
          </LoadingButton>
          <LoadingButton variant="outlined" color="primary" loading={loading} onClick={createManyInstancesHandler}>
            Create Many Instances
          </LoadingButton>
          <LoadingButton variant="outlined" color="error" loading={loading} onClick={deleteAllHandler}>
            Delete All
          </LoadingButton>
          <LoadingButton variant="outlined" color="primary" onClick={sendTestNotificationHandler}>
            Send Test Notification
          </LoadingButton>
          {/*<LoadingButton variant="outlined" color="primary" loading={loading} onClick={logApplicationsHealthHandler}>*/}
          {/*  Log Applications Health*/}
          {/*</LoadingButton>*/}
        </Stack>
      </CardContent>
    </Card>
  );
}
