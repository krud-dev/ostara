import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Link, Typography } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { AgentModifyRequestRO, AgentRO } from 'common/generated_definitions';
import { useCrudCreate } from 'renderer/apis/requests/crud/crudCreate';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import AgentDetailsForm, { AgentFormValues } from 'renderer/components/item/dialogs/forms/AgentDetailsForm';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';
import StepperPanel, { StepInfo } from 'renderer/components/layout/stepper/StepperPanel';
import { StepperContext, useStepperContext } from 'renderer/components/layout/stepper/StepperContext';
import {
  AGENT_KUBERNETES_DOCUMENTATION_URL,
  AGENT_SELF_HOSTED_DOCUMENTATION_URL,
  AGENT_SERVICE_DISCOVERY_DOCUMENTATION_URL,
  AGENT_TROUBLESHOOTING_DOCUMENTATION_URL,
  COMPONENTS_SPACING,
  REDACTION_DOCUMENTATION_URL,
} from 'renderer/constants/ui';
import CodeEditor from 'renderer/components/code/CodeEditor';
import { indentFoldingExtension } from 'renderer/components/code/extensions/indentFoldingExtension';

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
          label: <FormattedMessage id={'installationAndConfiguration'} />,
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
        maxWidth={'md'}
      >
        <DialogTitleEnhanced disabled={submitting} onClose={cancelHandler}>
          <FormattedMessage id={'createAgent'} />
        </DialogTitleEnhanced>
        <StepperPanel steps={steps} sx={{ mt: COMPONENTS_SPACING }}>
          <AgentOverview onCancel={cancelHandler} />
          <AgentInstallation />
          <StepperContext.Consumer>
            {({ previousStep }) => (
              <AgentDetailsForm
                defaultValues={{ parentFolderId }}
                onSubmit={submitHandler}
                cancelLabel={<FormattedMessage id={'previous'} />}
                onCancel={previousStep}
              />
            )}
          </StepperContext.Consumer>
        </StepperPanel>
      </Dialog>
    );
  }
);

export default CreateAgentDialog;

type AgentOverviewProps = { onCancel?: () => void };
function AgentOverview({ onCancel }: AgentOverviewProps) {
  const { nextStep } = useStepperContext();

  return (
    <>
      <DialogContent>
        <Typography variant={'subtitle1'}>
          <FormattedMessage id={'whatIsAnAgent'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'whatIsAnAgentText'} />
        </Typography>

        <Typography variant={'subtitle1'} sx={{ mt: 2 }}>
          <FormattedMessage id={'whatDoesAnAgentDo'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'whatDoesAnAgentDoText'} />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        {onCancel && (
          <Button variant="outlined" color="primary" onClick={onCancel}>
            <FormattedMessage id={'cancel'} />
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={nextStep}>
          <FormattedMessage id={'next'} />
        </Button>
      </DialogActions>
    </>
  );
}

function AgentInstallation() {
  const { nextStep, previousStep } = useStepperContext();

  const code = useMemo<string>(
    () =>
      `ostara:
  agent:
    main:
      api-key: <ChangeMe>
      service-discovery:
        kubernetes:
          enabled: true
          namespace: default`,
    []
  );

  return (
    <>
      <DialogContent>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'installingAgentSteps'} />
        </Typography>
        <Typography variant={'subtitle1'} sx={{ mt: 2 }}>
          <FormattedMessage id={'stepOne'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'installAgentInYourEnvironment'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage
            id={'installAgentInYourEnvironmentKubernetes'}
            values={{
              url: (
                <Link href={AGENT_KUBERNETES_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id={'here'} />
                </Link>
              ),
            }}
          />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage
            id={'installAgentInYourEnvironmentSelfHosted'}
            values={{
              url: (
                <Link href={AGENT_SELF_HOSTED_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id={'here'} />
                </Link>
              ),
            }}
          />
        </Typography>
        <Typography variant={'subtitle1'} sx={{ mt: 2 }}>
          <FormattedMessage id={'stepTwo'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'configurationIsDownViaOurYamlFile'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'configureKubernetesServiceDiscovery'} />
        </Typography>
        <CodeEditor language={'yaml'} value={code} readOnly extensions={[indentFoldingExtension]} />
        <Typography variant={'body2'} sx={{ color: 'text.secondary', mt: 2 }}>
          <FormattedMessage id={'makeSureAgentHasNetworkAccess'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary', mt: 2 }}>
          <FormattedMessage
            id={'agentServiceDiscoveryOptionsOverview'}
            values={{
              url: (
                <Link href={AGENT_SERVICE_DISCOVERY_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id={'here'} />
                </Link>
              ),
            }}
          />
        </Typography>
        <Typography variant={'subtitle1'} sx={{ mt: 2 }}>
          <FormattedMessage id={'stepThree'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={'agentInstallationNextStep'} />
        </Typography>
        <Typography variant={'body2'} sx={{ color: 'text.secondary', mt: 2 }}>
          <FormattedMessage
            id={'agentCheckTroubleshootingGuide'}
            values={{
              url: (
                <Link href={AGENT_TROUBLESHOOTING_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id={'here'} />
                </Link>
              ),
            }}
          />
        </Typography>
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
