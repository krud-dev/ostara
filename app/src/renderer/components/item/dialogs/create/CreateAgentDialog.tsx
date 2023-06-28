import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { AgentModifyRequestRO, AgentRO } from 'common/generated_definitions';
import { useCrudCreate } from 'renderer/apis/requests/crud/crudCreate';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import AgentDetailsForm, { AgentFormValues } from 'renderer/components/item/dialogs/forms/AgentDetailsForm';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

export type CreateAgentDialogProps = {
  onCreated?: (items: AgentRO[]) => void;
} & NiceModalHocProps;

const CreateFolderDialog: FunctionComponent<CreateAgentDialogProps> = NiceModal.create(({ onCreated }) => {
  const modal = useModal();
  const { track } = useAnalyticsContext();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const createState = useCrudCreate<AgentRO, AgentModifyRequestRO>();

  const submitHandler = useCallback(
    async (data: AgentFormValues): Promise<void> => {
      setSubmitting(true);

      const itemToCreate: AgentModifyRequestRO = {
        ...data,
      };
      try {
        const result = await createState.mutateAsync({ entity: agentCrudEntity, item: itemToCreate });
        if (result) {
          track({ name: 'add_agent' });

          onCreated?.([result]);

          modal.resolve(result);
          await modal.hide();
        }
      } catch (e) {
      } finally {
        setSubmitting(false);
      }
    },
    [onCreated, createState, modal]
  );

  const cancelHandler = useCallback((): void => {
    if (submitting) {
      return;
    }
    modal.resolve(undefined);
    modal.hide();
  }, [submitting, modal]);

  return (
    <Dialog
      open={modal.visible}
      onClose={cancelHandler}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
      fullWidth
      maxWidth={'xs'}
    >
      <DialogTitleEnhanced disabled={submitting} onClose={cancelHandler}>
        <FormattedMessage id={'createAgent'} />
      </DialogTitleEnhanced>
      <AgentDetailsForm defaultValues={{}} onSubmit={submitHandler} onCancel={cancelHandler} />
    </Dialog>
  );
});

export default CreateFolderDialog;
