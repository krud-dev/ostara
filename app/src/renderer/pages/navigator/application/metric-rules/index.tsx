import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { ADD_ID, DELETE_ID, UPDATE_ID } from 'renderer/entity/actions';
import { Box, Button, Card } from '@mui/material';
import { ApplicationMetricRuleRO, ApplicationRO } from '../../../../../common/generated_definitions';
import { useGetApplicationMetricRulesQuery } from '../../../../apis/requests/application/metric-rules/getApplicationMetricRules';
import { useDeleteApplicationMetricRule } from '../../../../apis/requests/application/metric-rules/deleteApplicationMetricRule';
import { applicationMetricRuleEntity } from '../../../../entity/entities/applicationMetricRule.entity';
import { IconViewer } from '../../../../components/common/IconViewer';
import NiceModal from '@ebay/nice-modal-react';
import UpdateMetricRuleDialog from './components/UpdateMetricRuleDialog';
import CreateMetricRuleDialog from './components/CreateMetricRuleDialog';

const ApplicationMetricRules: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const entity = useMemo<Entity<ApplicationMetricRuleRO>>(() => applicationMetricRuleEntity, []);
  const queryState = useGetApplicationMetricRulesQuery({ applicationId: item.id });

  const deleteMetricRuleState = useDeleteApplicationMetricRule();

  const actionsHandler = useCallback(
    async (actionId: string, row: ApplicationMetricRuleRO): Promise<void> => {
      switch (actionId) {
        case UPDATE_ID:
          await NiceModal.show<ApplicationMetricRuleRO | undefined>(UpdateMetricRuleDialog, {
            metricRule: row,
          });
          break;
        case DELETE_ID:
          try {
            await deleteMetricRuleState.mutateAsync({ applicationId: item.id, metricRuleId: row.id });
          } catch (e) {}
          break;
        default:
          break;
      }
    },
    [item]
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ApplicationMetricRuleRO[]): Promise<void> => {},
    []
  );

  const addHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<ApplicationMetricRuleRO | undefined>(CreateMetricRuleDialog, { applicationId: item.id });
  }, [item]);

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case ADD_ID:
          await addHandler();
          break;
        default:
          break;
      }
    },
    [addHandler]
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
                <FormattedMessage id={'metricNotificationsExplanation'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant={'outlined'}
                  color={'primary'}
                  startIcon={<IconViewer icon={'NotificationAddOutlined'} />}
                  onClick={addHandler}
                >
                  <FormattedMessage id={'addMetricNotification'} />
                </Button>
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

export default ApplicationMetricRules;
