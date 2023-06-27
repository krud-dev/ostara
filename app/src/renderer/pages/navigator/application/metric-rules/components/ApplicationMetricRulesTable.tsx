import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { FormattedMessage } from 'react-intl';
import { ADD_ID, DELETE_ID, UPDATE_ID } from 'renderer/entity/actions';
import { Box, Button, Typography } from '@mui/material';
import { ApplicationMetricRuleRO } from 'common/generated_definitions';
import { useGetApplicationMetricRulesQuery } from 'renderer/apis/requests/application/metric-rules/getApplicationMetricRules';
import { useDeleteApplicationMetricRule } from 'renderer/apis/requests/application/metric-rules/deleteApplicationMetricRule';
import { applicationMetricRuleEntity } from 'renderer/entity/entities/applicationMetricRule.entity';
import { IconViewer } from 'renderer/components/common/IconViewer';
import NiceModal from '@ebay/nice-modal-react';
import UpdateMetricRuleDialog, { UpdateMetricRuleDialogProps } from './UpdateMetricRuleDialog';
import CreateMetricRuleDialog, { CreateMetricRuleDialogProps } from './CreateMetricRuleDialog';
import PredefinedMetricRulesButton from 'renderer/pages/navigator/application/metric-rules/components/PredefinedMetricRulesButton';

type ApplicationMetricRulesTableProps = {
  applicationId: string;
  metricName?: string;
};

const ApplicationMetricRulesTable: FunctionComponent<ApplicationMetricRulesTableProps> = ({
  applicationId,
  metricName,
}) => {
  const entity = useMemo<Entity<ApplicationMetricRuleRO>>(() => applicationMetricRuleEntity, []);
  const queryState = useGetApplicationMetricRulesQuery({
    applicationId: applicationId,
    metricName: metricName,
  });

  const deleteMetricRuleState = useDeleteApplicationMetricRule();

  const actionsHandler = useCallback(
    async (actionId: string, row: ApplicationMetricRuleRO): Promise<void> => {
      switch (actionId) {
        case UPDATE_ID:
          await NiceModal.show<ApplicationMetricRuleRO | undefined, UpdateMetricRuleDialogProps>(
            UpdateMetricRuleDialog,
            {
              metricRule: row,
            }
          );
          break;
        case DELETE_ID:
          try {
            await deleteMetricRuleState.mutateAsync({ applicationId: applicationId, metricRuleId: row.id });
          } catch (e) {}
          break;
        default:
          break;
      }
    },
    [applicationId]
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ApplicationMetricRuleRO[]): Promise<void> => {},
    []
  );

  const addRuleHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<ApplicationMetricRuleRO | undefined, CreateMetricRuleDialogProps>(CreateMetricRuleDialog, {
      applicationId: applicationId,
      defaultValues: {
        metricName: metricName,
      },
    });
  }, [applicationId, metricName]);

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case ADD_ID:
          await addRuleHandler();
          break;
        default:
          break;
      }
    },
    [addRuleHandler]
  );

  return (
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
              onClick={addRuleHandler}
            >
              <FormattedMessage id={'addMetricNotification'} />
            </Button>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 0.75 }}>
              <FormattedMessage id="or" />
            </Typography>

            <PredefinedMetricRulesButton applicationId={applicationId} metricName={metricName} />
          </Box>
        </>
      }
      refetchHandler={queryState.refetch}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    />
  );
};

export default ApplicationMetricRulesTable;
