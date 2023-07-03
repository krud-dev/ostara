import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import FolderDetailsForm, { FolderFormValues } from 'renderer/components/item/dialogs/forms/FolderDetailsForm';
import { useCrudUpdate } from 'renderer/apis/requests/crud/crudUpdate';
import { FolderModifyRequestRO, FolderRO } from 'common/generated_definitions';
import { folderCrudEntity } from 'renderer/apis/requests/crud/entity/entities/folder.crudEntity';
import { useItemsContext } from 'renderer/contexts/ItemsContext';

export type UpdateFolderDialogProps = {
  item: FolderRO;
  onUpdated?: (item: FolderRO) => void;
} & NiceModalHocProps;

const UpdateFolderDialog: FunctionComponent<UpdateFolderDialogProps> = NiceModal.create(({ item, onUpdated }) => {
  const modal = useModal();
  const { addItem } = useItemsContext();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const updateState = useCrudUpdate<FolderRO, FolderModifyRequestRO>({ refetchNone: true });

  const submitHandler = useCallback(async (data: FolderFormValues): Promise<void> => {
    setSubmitting(true);

    try {
      const result = await updateState.mutateAsync({
        entity: folderCrudEntity,
        id: item.id,
        item: { ...item, ...data },
      });
      if (result) {
        addItem(result);

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
        <FormattedMessage id={'updateFolder'} />
      </DialogTitleEnhanced>
      <FolderDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
    </Dialog>
  );
});

export default UpdateFolderDialog;
