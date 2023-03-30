import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { InstanceRO, ThreadProfilingRequestRO } from '../../../../../common/generated_definitions';
import { DELETE_ID, REQUEST_ID, VIEW_ID } from '../../../../entity/actions';
import { useSnackbar } from 'notistack';
import { instanceThreadProfilingRequestEntity } from '../../../../entity/entities/instanceThreadProfilingRequest.entity';
import { useGetInstanceThreadProfilingRequestsQuery } from '../../../../apis/requests/instance/thread-profiling/getInstanceThreadProfilingRequests';
import { useDeleteInstanceThreadProfiling } from '../../../../apis/requests/instance/thread-profiling/deleteInstanceThreadProfiling';
import { useRequestInstanceThreadProfiling } from '../../../../apis/requests/instance/thread-profiling/requestInstanceThreadProfiling';
import { FormattedMessage } from 'react-intl';
import NiceModal from '@ebay/nice-modal-react';
import ThreadProfilingRequestDetailsDialog from './components/ThreadProfilingRequestDetailsDialog';

const InstanceThreadProfiling: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<ThreadProfilingRequestRO>>(() => instanceThreadProfilingRequestEntity, []);
  const queryState = useGetInstanceThreadProfilingRequestsQuery({ instanceId: item.id });

  const deleteHeapdumpState = useDeleteInstanceThreadProfiling();
  const actionsHandler = useCallback(async (actionId: string, row: ThreadProfilingRequestRO): Promise<void> => {
    switch (actionId) {
      case VIEW_ID:
        await NiceModal.show<undefined>(ThreadProfilingRequestDetailsDialog, {
          request: row,
        });
        break;
      case DELETE_ID:
        try {
          await deleteHeapdumpState.mutateAsync({ instanceId: row.instanceId, requestId: row.id });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ThreadProfilingRequestRO[]): Promise<void> => {},
    []
  );

  const requestState = useRequestInstanceThreadProfiling();
  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {
    switch (actionId) {
      case REQUEST_ID:
        try {
          const result = await requestState.mutateAsync({
            request: { instanceId: item.id, durationSec: 60 },
          });
          if (result) {
            enqueueSnackbar(<FormattedMessage id="threadDumpRequestedSuccessfully" />, { variant: 'success' });
          }
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={queryState.data}
          loading={queryState.isLoading}
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default InstanceThreadProfiling;
