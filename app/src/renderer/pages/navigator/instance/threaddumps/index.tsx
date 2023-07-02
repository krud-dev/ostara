import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Card } from '@mui/material';
import { InstanceRO, ThreadProfilingProgressMessage$Payload } from 'common/generated_definitions';
import { DELETE_ID, REQUEST_ID, VIEW_ID } from 'renderer/entity/actions';
import { useSnackbar } from 'notistack';
import { instanceThreadProfilingRequestEntity } from 'renderer/entity/entities/instanceThreadProfilingRequest.entity';
import {
  EnrichedThreadProfilingRequestRO,
  useGetInstanceThreadProfilingRequestsQuery,
} from 'renderer/apis/requests/instance/thread-profiling/getInstanceThreadProfilingRequests';
import { useDeleteInstanceThreadProfiling } from 'renderer/apis/requests/instance/thread-profiling/deleteInstanceThreadProfiling';
import { useRequestInstanceThreadProfiling } from 'renderer/apis/requests/instance/thread-profiling/requestInstanceThreadProfiling';
import { FormattedMessage } from 'react-intl';
import NiceModal from '@ebay/nice-modal-react';
import ThreadProfilingRequestDetailsDialog, {
  ThreadProfilingRequestDetailsDialogProps,
} from './components/ThreadProfilingRequestDetailsDialog';
import { useStompContext } from 'renderer/apis/websockets/StompContext';
import { LoadingButton } from '@mui/lab';
import { IconViewer } from 'renderer/components/common/IconViewer';

const InstanceThreadProfiling: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();
  const { subscribe } = useStompContext();
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
        await NiceModal.show<undefined, ThreadProfilingRequestDetailsDialogProps>(ThreadProfilingRequestDetailsDialog, {
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
            enqueueSnackbar(<FormattedMessage id="threadProfilingInitiated" />, { variant: 'success' });
          }
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const [requestLoading, setRequestLoading] = useState<boolean>(false);

  const requestHandler = useCallback(async (): Promise<void> => {
    setRequestLoading(true);
    await globalActionsHandler(REQUEST_ID);
    setRequestLoading(false);
  }, [globalActionsHandler, setRequestLoading]);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={data}
          loading={loading}
          emptyContent={
            <>
              <Box>
                <FormattedMessage id={'requestThreadProfilingExplanation'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <LoadingButton
                  variant={'outlined'}
                  color={'primary'}
                  loading={requestLoading}
                  startIcon={<IconViewer icon={'SpeedOutlined'} />}
                  onClick={requestHandler}
                >
                  <FormattedMessage id={'requestThreadProfiling'} />
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

export default InstanceThreadProfiling;
