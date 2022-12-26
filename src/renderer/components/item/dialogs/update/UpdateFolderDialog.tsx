import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { EnrichedFolder, Folder } from 'infra/configuration/model/configuration';
import ApplicationDetailsForm from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';
import { useUpdateFolder } from 'renderer/apis/configuration/folder/updateFolder';
import { FolderFormValues } from 'renderer/components/item/dialogs/forms/FolderDetailsForm';

export type UpdateFolderDialogProps = {
  item: Folder;
  onUpdated?: (item: EnrichedFolder) => void;
};

const UpdateFolderDialog: FunctionComponent<UpdateFolderDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ item, onUpdated }) => {
    const modal = useModal();

    const updateItemState = useUpdateFolder();

    const submitHandler = useCallback(async (data: FolderFormValues): Promise<void> => {
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
          <FormattedMessage id={'updateFolder'} />
        </DialogTitleEnhanced>
        <ApplicationDetailsForm defaultValues={item} onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default UpdateFolderDialog;
