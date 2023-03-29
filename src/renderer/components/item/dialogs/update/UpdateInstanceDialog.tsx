import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';
import { InstanceModifyRequestRO, InstanceRO } from '../../../../../common/generated_definitions';
import { useCrudUpdate } from '../../../../apis/requests/crud/crudUpdate';
import { instanceCrudEntity } from '../../../../apis/requests/crud/entity/entities/instance.crudEntity';

export type UpdateInstanceDialogProps = {
  item: InstanceRO;
  onUpdated?: (item: InstanceRO) => void;
};

const UpdateInstanceDialog: FunctionComponent<UpdateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ item, onUpdated }) => {
    const modal = useModal();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const updateState = useCrudUpdate<InstanceRO, InstanceModifyRequestRO>();

    const submitHandler = useCallback(async (data: InstanceFormValues): Promise<void> => {
      setSubmitting(true);

      try {
        const result = await updateState.mutateAsync({
          entity: instanceCrudEntity,
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
          <FormattedMessage id={'updateInstance'} />
        </DialogTitleEnhanced>
        <InstanceDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default UpdateInstanceDialog;
