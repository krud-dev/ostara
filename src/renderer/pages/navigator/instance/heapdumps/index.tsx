import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { InstanceHeapdumpReferenceRO, InstanceRO } from '../../../../../common/generated_definitions';
import { instanceHeapdumpReferencesEntity } from '../../../../entity/entities/instanceHeapdumpReferences.entity';
import { useGetInstanceHeapdumpReferencesQuery } from '../../../../apis/requests/instance/getInstanceHeapdumpReferences';
import { DELETE_ID, DOWNLOAD_ID, REQUEST_ID } from '../../../../entity/actions';
import { FormattedMessage } from 'react-intl';
import { useRequestInstanceHeapdump } from '../../../../apis/requests/instance/requestInstanceHeapdump';
import { useSnackbar } from 'notistack';
import { useDeleteInstanceHeapdumpReference } from '../../../../apis/requests/instance/deleteInstanceHeapdumpReference';
import { useDownloadInstanceHeapdumpReference } from '../../../../apis/requests/instance/downloadInstanceHeapdumpReference';

const InstanceHeapdumpReferences: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { enqueueSnackbar } = useSnackbar();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<InstanceHeapdumpReferenceRO>>(() => instanceHeapdumpReferencesEntity, []);
  const queryState = useGetInstanceHeapdumpReferencesQuery({ instanceId: item.id });

  const downloadHeapdumpState = useDownloadInstanceHeapdumpReference();
  const deleteHeapdumpState = useDeleteInstanceHeapdumpReference();

  const actionsHandler = useCallback(async (actionId: string, row: InstanceHeapdumpReferenceRO): Promise<void> => {
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
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: InstanceHeapdumpReferenceRO[]): Promise<void> => {},
    []
  );

  const requestHeapdumpState = useRequestInstanceHeapdump();
  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {
    switch (actionId) {
      case REQUEST_ID:
        try {
          await requestHeapdumpState.mutateAsync({ instanceId: item.id });
          enqueueSnackbar(<FormattedMessage id={'heapdumpRequestedSuccessfully'} />, {
            variant: 'success',
          });
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
          queryState={queryState}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default InstanceHeapdumpReferences;
