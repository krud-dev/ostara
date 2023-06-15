import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Card } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { SystemBackupRO } from 'common/generated_definitions';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { systemBackupEntity } from 'renderer/entity/entities/systemBackup.entity';
import { useGetSystemBackupsQuery } from 'renderer/apis/requests/system-backup/getSystemBackups';
import { BACKUP_ID, DELETE_ID, RESTORE_ID } from 'renderer/entity/actions';
import { useCreateSystemBackup } from 'renderer/apis/requests/system-backup/createSystemBackup';
import { useDeleteSystemBackup } from 'renderer/apis/requests/system-backup/deleteSystemBackup';

const SettingsBackups: FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();

  const entity = useMemo<Entity<SystemBackupRO>>(() => systemBackupEntity, []);
  const queryState = useGetSystemBackupsQuery({});

  const deleteBackupState = useDeleteSystemBackup();

  const actionsHandler = useCallback(async (actionId: string, row: SystemBackupRO): Promise<void> => {
    switch (actionId) {
      case RESTORE_ID:
        break;
      case DELETE_ID:
        try {
          await deleteBackupState.mutateAsync({ fileName: row.fileName });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: SystemBackupRO[]): Promise<void> => {},
  []);

  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const createBackupState = useCreateSystemBackup();

  const backupHandler = useCallback(async (): Promise<void> => {
    setRequestLoading(true);

    try {
      await createBackupState.mutateAsync({});
      enqueueSnackbar(<FormattedMessage id={'backupCreatedSuccessfully'} />, {
        variant: 'success',
      });
    } catch (e) {}

    setRequestLoading(false);
  }, [setRequestLoading]);

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case BACKUP_ID:
          await backupHandler();
          break;
        default:
          break;
      }
    },
    [backupHandler]
  );

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={queryState.data}
          loading={queryState.isLoading}
          emptyContent={
            <>
              <Box>
                <FormattedMessage id={'createBackupExplanation'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <LoadingButton
                  variant={'outlined'}
                  color={'primary'}
                  loading={requestLoading}
                  startIcon={<IconViewer icon={'MoreTimeOutlined'} />}
                  onClick={backupHandler}
                >
                  <FormattedMessage id={'backupNow'} />
                </LoadingButton>
              </Box>
            </>
          }
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default SettingsBackups;
