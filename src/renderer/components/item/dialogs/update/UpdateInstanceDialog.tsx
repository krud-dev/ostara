import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Instance } from 'infra/configuration/model/configuration';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';
import { useUpdateInstance } from 'renderer/apis/configuration/instance/updateInstance';

export type UpdateInstanceDialogProps = {
  item: Instance;
  onUpdated?: (item: Instance) => void;
};

const UpdateInstanceDialog: FunctionComponent<UpdateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ item, onUpdated }) => {
    const modal = useModal();

    const updateItemState = useUpdateInstance();

    const submitHandler = useCallback(async (data: InstanceFormValues): Promise<void> => {
      try {
        const result = await updateItemState.mutateAsync({
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
          <FormattedMessage id={'updateInstance'} />
        </DialogTitleEnhanced>
        <InstanceDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default UpdateInstanceDialog;
