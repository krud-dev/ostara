import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import ApplicationDetailsForm, {
  ApplicationFormValues,
} from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';
import { useCrudCreate } from '../../../../apis/crud/crudCreate';
import { ApplicationModifyRequestRO, ApplicationRO } from '../../../../../common/generated_definitions';
import { applicationCrudEntity } from '../../../../apis/crud/entity/entities/application.crud-entity';

export type CreateApplicationDialogProps = {
  parentFolderId?: string;
  sort?: number;
  onCreated?: (item: ApplicationRO) => void;
};

const CreateApplicationDialog: FunctionComponent<CreateApplicationDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, sort, onCreated }) => {
    const modal = useModal();

    const createState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>();

    const submitHandler = useCallback(
      async (data: ApplicationFormValues): Promise<void> => {
        const itemToCreate: ApplicationModifyRequestRO = {
          // dataCollectionMode: 'on',
          alias: data.alias,
          type: 'SPRING_BOOT',
          parentFolderId: parentFolderId,
          sort: sort ?? 1,
        };
        try {
          const result = await createState.mutateAsync({
            entity: applicationCrudEntity,
            item: itemToCreate,
          });
          if (result) {
            onCreated?.(result);

            modal.resolve(result);
            modal.hide();
          }
        } catch (e) {}
      },
      [parentFolderId, sort, onCreated, createState, modal]
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
