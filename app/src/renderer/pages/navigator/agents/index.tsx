import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Button, Card } from '@mui/material';
import { AgentRO } from 'common/generated_definitions';
import { ADD_ID, DELETE_ID, UPDATE_ID } from 'renderer/entity/actions';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { FormattedMessage } from 'react-intl';
import { agentEntity } from 'renderer/entity/entities/agent.entity';
import CreateAgentDialog, { CreateAgentDialogProps } from 'renderer/components/item/dialogs/create/CreateAgentDialog';
import NiceModal from '@ebay/nice-modal-react';
import UpdateAgentDialog, { UpdateAgentDialogProps } from 'renderer/components/item/dialogs/update/UpdateAgentDialog';
import { useCrudDelete } from 'renderer/apis/requests/crud/crudDelete';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';
import { showDeleteConfirmationDialog } from 'renderer/utils/dialogUtils';

const Agents: FunctionComponent = () => {
  const { agents, refetchAgents } = useItemsContext();

  const entity = useMemo<Entity<AgentRO>>(() => agentEntity, []);
  const data = useMemo<AgentRO[] | undefined>(() => agents, [agents]);
  const loading = useMemo<boolean>(() => !data, [data]);

  const deleteState = useCrudDelete();

  const actionsHandler = useCallback(
    async (actionId: string, row: AgentRO): Promise<void> => {
      switch (actionId) {
        case UPDATE_ID:
          await NiceModal.show<AgentRO[] | undefined, UpdateAgentDialogProps>(UpdateAgentDialog, {
            item: row,
          });
          break;
        case DELETE_ID:
          {
            const confirm = await showDeleteConfirmationDialog(row.name);
            if (!confirm) {
              return;
            }
            await deleteState.mutateAsync({ entity: agentCrudEntity, id: row.id });
          }
          break;
        default:
          break;
      }
    },
    [deleteState]
  );

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: AgentRO[]): Promise<void> => {}, []);

  const createAgentHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<AgentRO[] | undefined, CreateAgentDialogProps>(CreateAgentDialog, {});
  }, []);

  const globalActionsHandler = useCallback(
    async (actionId: string): Promise<void> => {
      switch (actionId) {
        case ADD_ID:
          await createAgentHandler();
          break;
        default:
          break;
      }
    },
    [createAgentHandler]
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
                <FormattedMessage id={'agentsDescription'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant={'outlined'} color={'primary'} onClick={createAgentHandler}>
                  <FormattedMessage id={'createAgent'} />
                </Button>
              </Box>
            </>
          }
          refetchHandler={refetchAgents}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default Agents;
