import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Folder } from 'infra/configuration/model/configuration';
import { useCreateFolder } from 'renderer/apis/configuration/folder/createFolder';
import FolderDetailsForm, { FolderFormValues } from 'renderer/components/item/dialogs/forms/FolderDetailsForm';

export type CreateFolderDialogProps = {
  parentFolderId?: string;
  order?: number;
  onCreated?: (item: Folder) => void;
};

const CreateFolderDialog: FunctionComponent<CreateFolderDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, order, onCreated }) => {
    const modal = useModal();

    const createState = useCreateFolder();

    const submitHandler = useCallback(
      async (data: FolderFormValues): Promise<void> => {
        const itemToCreate: Omit<Folder, 'id' | 'type'> = {
          alias: data.alias,
          parentFolderId: parentFolderId,
          order: order ?? 1,
        };
        try {
          const result = await createState.mutateAsync({ item: itemToCreate });
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
          <FormattedMessage id={'createFolder'} />
        </DialogTitleEnhanced>
        <FolderDetailsForm onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default CreateFolderDialog;
