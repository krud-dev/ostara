import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { AgentModifyRequestRO, AgentRO } from 'common/generated_definitions';
import { useCrudCreate } from 'renderer/apis/requests/crud/crudCreate';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import AgentDetailsForm, { AgentFormValues } from 'renderer/components/item/dialogs/forms/AgentDetailsForm';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';
import StepperPanel, { StepInfo } from 'renderer/components/layout/stepper/StepperPanel';
import { useStepperContext } from 'renderer/components/layout/stepper/StepperContext';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

export type CreateAgentDialogProps = {
  parentFolderId?: string;
  sort?: number;
  onCreated?: (items: AgentRO[]) => void;
} & NiceModalHocProps;

const CreateAgentDialog: FunctionComponent<CreateAgentDialogProps> = NiceModal.create(
  ({ parentFolderId, sort, onCreated }) => {
    const modal = useModal();
    const { track } = useAnalyticsContext();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const steps = useMemo<StepInfo[]>(
      () => [
        {
          id: 'overview',
          label: <FormattedMessage id={'overview'} />,
        },
        {
          id: 'installation',
          label: <FormattedMessage id={'installAgent'} />,
        },
        {
          id: 'creation',
          label: <FormattedMessage id={'addAgent'} />,
        },
      ],
      []
    );

    const createState = useCrudCreate<AgentRO, AgentModifyRequestRO>();

    const submitHandler = useCallback(
      async (data: AgentFormValues): Promise<void> => {
        setSubmitting(true);

        const itemToCreate: AgentModifyRequestRO = {
          ...data,
          parentFolderId: parentFolderId,
          sort: sort ?? 1,
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
        maxWidth={'sm'}
      >
        <DialogTitleEnhanced disabled={submitting} onClose={cancelHandler}>
          <FormattedMessage id={'createAgent'} />
        </DialogTitleEnhanced>
        <StepperPanel steps={steps} sx={{ mt: COMPONENTS_SPACING }}>
          <AgentOverview />
          <AgentInstallation />
          <AgentDetailsForm defaultValues={{ parentFolderId }} onSubmit={submitHandler} onCancel={cancelHandler} />
        </StepperPanel>
      </Dialog>
    );
  }
);

export default CreateAgentDialog;

function AgentOverview() {
  const { nextStep } = useStepperContext();

  return (
    <>
      <DialogContent>
        <Box>Overview.....</Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="primary" onClick={nextStep}>
          <FormattedMessage id={'next'} />
        </Button>
      </DialogActions>
    </>
  );
}

function AgentInstallation() {
  const { nextStep, previousStep } = useStepperContext();

  return (
    <>
      <DialogContent>
        <Box>Installation.....</Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="primary" onClick={previousStep}>
          <FormattedMessage id={'previous'} />
        </Button>
        <Button variant="contained" color="primary" onClick={nextStep}>
          <FormattedMessage id={'next'} />
        </Button>
      </DialogActions>
    </>
  );
}
