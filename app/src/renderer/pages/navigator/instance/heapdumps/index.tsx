import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Card } from '@mui/material';
import {
  InstanceHeapdumpDownloadProgressMessage$Payload,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { instanceHeapdumpReferencesEntity } from '../../../../entity/entities/instanceHeapdumpReferences.entity';
import {
  EnrichedInstanceHeapdumpReferenceRO,
  useGetInstanceHeapdumpReferencesQuery,
} from '../../../../apis/requests/instance/heapdumps/getInstanceHeapdumpReferences';
import { DELETE_ID, DOWNLOAD_ID, REQUEST_ID } from '../../../../entity/actions';
import { FormattedMessage } from 'react-intl';
import { useRequestInstanceHeapdump } from '../../../../apis/requests/instance/heapdumps/requestInstanceHeapdump';
import { useSnackbar } from 'notistack';
import { useDeleteInstanceHeapdumpReference } from '../../../../apis/requests/instance/heapdumps/deleteInstanceHeapdumpReference';
import { useDownloadInstanceHeapdumpReference } from '../../../../apis/requests/instance/heapdumps/downloadInstanceHeapdumpReference';
import { useStomp } from '../../../../apis/websockets/StompContext';
import { LoadingButton } from '@mui/lab';
import { IconViewer } from '../../../../components/common/IconViewer';

const InstanceHeapdumpReferences: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();
  const { subscribe } = useStomp();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceHeapdumpReferenceRO>>(() => instanceHeapdumpReferencesEntity, []);
  const queryState = useGetInstanceHeapdumpReferencesQuery({ instanceId: item.id });

  const [data, setData] = useState<EnrichedInstanceHeapdumpReferenceRO[] | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

  useEffect(() => {
    setData(queryState.data);
  }, [queryState.data]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceHeapdumpDownloadProgress',
      {},
      (downloadChanged: InstanceHeapdumpDownloadProgressMessage$Payload): void => {
        setData((prev) =>
          prev?.map((h) =>
            h.id === downloadChanged.referenceId
              ? {
                  ...h,
                  status: downloadChanged.status,
                  error: downloadChanged.error,
                  size: downloadChanged.contentLength,
                  bytesRead: downloadChanged.bytesRead,
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

  const downloadHeapdumpState = useDownloadInstanceHeapdumpReference();
  const deleteHeapdumpState = useDeleteInstanceHeapdumpReference();

  const actionsHandler = useCallback(
    async (actionId: string, row: EnrichedInstanceHeapdumpReferenceRO): Promise<void> => {
      switch (actionId) {
        case DOWNLOAD_ID:
          try {
            await downloadHeapdumpState.mutateAsync({ reference: row });
          } catch (e) {
            enqueueSnackbar(<FormattedMessage id={'heapdumpDownloadFailed'} />, {
              variant: 'error',
            });
          }
          break;
        case DELETE_ID:
          try {
            await deleteHeapdumpState.mutateAsync({ instanceId: row.instanceId, referenceId: row.id });
          } catch (e) {}
          break;
        default:
          break;
      }
    },
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceHeapdumpReferenceRO[]): Promise<void> => {},
    []
  );

  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const requestHeapdumpState = useRequestInstanceHeapdump();

  const requestHandler = useCallback(async (): Promise<void> => {
    setRequestLoading(true);

    try {
      await requestHeapdumpState.mutateAsync({ instanceId: item.id });
      enqueueSnackbar(<FormattedMessage id={'heapdumpRequestedSuccessfully'} />, {
        variant: 'success',
      });
    } catch (e) {}

    setRequestLoading(false);
  }, [item, setRequestLoading]);

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case REQUEST_ID:
          await requestHandler();
          break;
        default:
          break;
      }
    },
    [requestHandler]
  );

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
                <FormattedMessage id={'requestHeapdumpExplanation'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <LoadingButton
                  variant={'outlined'}
                  color={'primary'}
                  loading={requestLoading}
                  startIcon={<IconViewer icon={'BrowserUpdatedOutlined'} />}
                  onClick={requestHandler}
                >
                  <FormattedMessage id={'requestHeapdump'} />
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

export default InstanceHeapdumpReferences;
