import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import ApplicationDetailsForm, {
  ApplicationFormValues,
} from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';
import { ApplicationModifyRequestRO, ApplicationRO } from '../../../../../common/generated_definitions';
import { useCrudUpdate } from '../../../../apis/requests/crud/crudUpdate';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';

export type UpdateApplicationDialogProps = {
  item: ApplicationRO;
  onUpdated?: (item: ApplicationRO) => void;
};

const UpdateApplicationDialog: FunctionComponent<UpdateApplicationDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ item, onUpdated }) => {
    const modal = useModal();

    const updateState = useCrudUpdate<ApplicationRO, ApplicationModifyRequestRO>();

    const submitHandler = useCallback(async (data: ApplicationFormValues): Promise<void> => {
      try {
        const result = await updateState.mutateAsync({
          entity: applicationCrudEntity,
          id: item.id,
          item: { ...item, ...data },
        });
        if (result) {
          onUpdated?.(result);

          modal.resolve(result);
          modal.hide();
        }
      } catch (e) {}
    }, []);

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
          <FormattedMessage id={'updateApplication'} />
        </DialogTitleEnhanced>
        <ApplicationDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default UpdateApplicationDialog;
