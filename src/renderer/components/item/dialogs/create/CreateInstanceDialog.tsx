import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Application, EnrichedInstance, Instance } from 'infra/configuration/model/configuration';
import { useCreateApplication } from 'renderer/apis/configuration/application/createApplication';
import { useCreateInstance } from 'renderer/apis/configuration/instance/createInstance';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';

export type CreateInstanceDialogProps = {
  parentApplicationId?: string;
  parentFolderId?: string;
  order?: number;
  onCreated?: (item: EnrichedInstance) => void;
};

const CreateInstanceDialog: FunctionComponent<CreateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentApplicationId, parentFolderId, order, onCreated }) => {
    const modal = useModal();

    const createApplicationState = useCreateApplication();
    const createInstanceState = useCreateInstance();

    const submitHandler = useCallback(
      async (data: InstanceFormValues): Promise<void> => {
        try {
          let instanceParentApplicationId = parentApplicationId;
          let instanceOrder = order ?? 1;

          if (!instanceParentApplicationId) {
            const applicationToCreate: Omit<Application, 'id' | 'type'> = {
              // dataCollectionMode: 'on',
              alias: data.alias,
              applicationType: 'SpringBoot',
              parentFolderId: parentFolderId,
              order: order ?? 1,
            };

            const application = await createApplicationState.mutateAsync({
              item: applicationToCreate,
            });

            instanceParentApplicationId = application.id;
            instanceOrder = 1;
          }

          const instanceToCreate: Omit<Instance, 'id' | 'type'> = {
            // dataCollectionMode: 'inherited',
            alias: data.alias,
            actuatorUrl: data.actuatorUrl,
            dataCollectionIntervalSeconds: data.dataCollectionIntervalSeconds,
            parentApplicationId: instanceParentApplicationId,
            order: instanceOrder,
          };

          const result = await createInstanceState.mutateAsync({
            item: instanceToCreate,
          });
          if (result) {
            onCreated?.(result);

            modal.resolve(result);
            modal.hide();
          }
        } catch (e) {}
      },
      [parentApplicationId, parentFolderId, order, onCreated, modal, createApplicationState, createInstanceState]
    );

    const cancelHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

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
        <DialogTitleEnhanced onClose={cancelHandler}>
          <FormattedMessage id={'createInstance'} />
        </DialogTitleEnhanced>
        <InstanceDetailsForm onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default CreateInstanceDialog;
