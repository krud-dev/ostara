import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { useCrudUpdate } from 'renderer/apis/requests/crud/crudUpdate';
import { AgentModifyRequestRO, AgentRO } from 'common/generated_definitions';
import AgentDetailsForm, { AgentFormValues } from 'renderer/components/item/dialogs/forms/AgentDetailsForm';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

export type UpdateAgentDialogProps = {
  item: AgentRO;
  onUpdated?: (item: AgentRO) => void;
} & NiceModalHocProps;

const UpdateAgentDialog: FunctionComponent<UpdateAgentDialogProps> = NiceModal.create(({ item, onUpdated }) => {
  const modal = useModal();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const updateState = useCrudUpdate<AgentRO, AgentModifyRequestRO>();

  const submitHandler = useCallback(async (data: AgentFormValues): Promise<void> => {
    setSubmitting(true);

    try {
      const result = await updateState.mutateAsync({
        entity: agentCrudEntity,
        id: item.id,
        item: { ...item, ...data },
      });
      if (result) {
        onUpdated?.(result);

        modal.resolve(result);
        await modal.hide();
      }
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  }, []);

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
        <FormattedMessage id={'updateAgent'} />
      </DialogTitleEnhanced>
      <AgentDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
    </Dialog>
  );
});

export default UpdateAgentDialog;
