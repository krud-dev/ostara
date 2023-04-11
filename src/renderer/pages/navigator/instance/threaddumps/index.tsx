import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import {
  InstanceRO,
  ThreadProfilingProgressMessage$Payload,
  ThreadProfilingRequestRO,
} from '../../../../../common/generated_definitions';
import { DELETE_ID, REQUEST_ID, VIEW_ID } from '../../../../entity/actions';
import { useSnackbar } from 'notistack';
import { instanceThreadProfilingRequestEntity } from '../../../../entity/entities/instanceThreadProfilingRequest.entity';
import {
  EnrichedThreadProfilingRequestRO,
  useGetInstanceThreadProfilingRequestsQuery,
} from '../../../../apis/requests/instance/thread-profiling/getInstanceThreadProfilingRequests';
import { useDeleteInstanceThreadProfiling } from '../../../../apis/requests/instance/thread-profiling/deleteInstanceThreadProfiling';
import { useRequestInstanceThreadProfiling } from '../../../../apis/requests/instance/thread-profiling/requestInstanceThreadProfiling';
import { FormattedMessage } from 'react-intl';
import NiceModal from '@ebay/nice-modal-react';
import ThreadProfilingRequestDetailsDialog from './components/ThreadProfilingRequestDetailsDialog';
import { useStomp } from '../../../../apis/websockets/StompContext';

const InstanceThreadProfiling: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { subscribe } = useStomp();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedThreadProfilingRequestRO>>(() => instanceThreadProfilingRequestEntity, []);
  const queryState = useGetInstanceThreadProfilingRequestsQuery({ instanceId: item.id });

  const [data, setData] = useState<EnrichedThreadProfilingRequestRO[] | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

  useEffect(() => {
    setData(queryState.data);
  }, [queryState.data]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceThreadProfilingProgress',
      {},
      (progressChanged: ThreadProfilingProgressMessage$Payload): void => {
        setData((prev) =>
          prev?.map((h) =>
            h.id === progressChanged.requestId
              ? {
                  ...h,
                  status: progressChanged.status,
                  secondsRemaining: progressChanged.secondsRemaining,
                }
              : h
          )
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const deleteHeapdumpState = useDeleteInstanceThreadProfiling();
  const actionsHandler = useCallback(async (actionId: string, row: EnrichedThreadProfilingRequestRO): Promise<void> => {
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
    async (actionId: string, selectedRows: EnrichedThreadProfilingRequestRO[]): Promise<void> => {},
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
          data={data}
          loading={loading}
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
