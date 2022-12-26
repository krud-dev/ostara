import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Application, EnrichedApplication } from 'infra/configuration/model/configuration';
import { useCreateApplication } from 'renderer/apis/configuration/application/createApplication';
import ApplicationDetailsForm, {
  ApplicationFormValues,
} from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';

export type CreateApplicationDialogProps = {
  parentFolderId?: string;
  order?: number;
  onCreated?: (item: EnrichedApplication) => void;
};

const CreateApplicationDialog: FunctionComponent<CreateApplicationDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, order, onCreated }) => {
    const modal = useModal();

    const createState = useCreateApplication();

    const submitHandler = useCallback(
      async (data: ApplicationFormValues): Promise<void> => {
        const itemToCreate: Omit<Application, 'id' | 'type'> = {
          dataCollectionMode: 'on',
          alias: data.alias,
          applicationType: 'SpringBoot',
          parentFolderId: parentFolderId,
          order: order ?? 1,
        };
        try {
          const result = await createState.mutateAsync({
            item: itemToCreate,
          });
          if (result) {
            onCreated?.(result);

            modal.resolve(result);
            modal.hide();
          }
        } catch (e) {}
      },
      [parentFolderId, order, onCreated, createState, modal]
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
          <FormattedMessage id={'createApplication'} />
        </DialogTitleEnhanced>
        <ApplicationDetailsForm onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default CreateApplicationDialog;
