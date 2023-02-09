import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import FolderDetailsForm, { FolderFormValues } from 'renderer/components/item/dialogs/forms/FolderDetailsForm';
import { FolderModifyRequestRO, FolderRO } from '../../../../../common/generated_definitions';
import { useCrudCreate } from '../../../../apis/crud/crudCreate';
import { folderCrudEntity } from '../../../../apis/crud/entity/entities/folder.crud-entity';

export type CreateFolderDialogProps = {
  parentFolderId?: string;
  sort?: number;
  onCreated?: (item: FolderRO) => void;
};

const CreateFolderDialog: FunctionComponent<CreateFolderDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, sort, onCreated }) => {
    const modal = useModal();

    const createState = useCrudCreate<FolderRO, FolderModifyRequestRO>();

    const submitHandler = useCallback(
      async (data: FolderFormValues): Promise<void> => {
        const itemToCreate: FolderModifyRequestRO = {
          alias: data.alias,
          parentFolderId: parentFolderId,
          sort: sort ?? 1,
        };
        try {
          const result = await createState.mutateAsync({ entity: folderCrudEntity, item: itemToCreate });
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
          <FormattedMessage id={'createFolder'} />
        </DialogTitleEnhanced>
        <FolderDetailsForm onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default CreateFolderDialog;
