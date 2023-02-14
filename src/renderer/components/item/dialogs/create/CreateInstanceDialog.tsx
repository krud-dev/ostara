import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';
import { useCrudCreate } from '../../../../apis/crud/crudCreate';
import {
  ApplicationModifyRequestRO,
  ApplicationRO,
  InstanceModifyRequestRO,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { applicationCrudEntity } from '../../../../apis/crud/entity/entities/application.crud-entity';
import { instanceCrudEntity } from '../../../../apis/crud/entity/entities/instance.crud-entity';
import { INHERITED_COLOR_VALUE } from '../../../../hooks/useItemColor';

export type CreateInstanceDialogProps = {
  parentApplicationId?: string;
  parentFolderId?: string;
  sort?: number;
  onCreated?: (item: InstanceRO) => void;
};

const CreateInstanceDialog: FunctionComponent<CreateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentApplicationId, parentFolderId, sort, onCreated }) => {
    const modal = useModal();

    const createApplicationState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>();
    const createInstanceState = useCrudCreate<InstanceRO, InstanceModifyRequestRO>();

    const submitHandler = useCallback(
      async (data: InstanceFormValues): Promise<void> => {
        try {
          let instanceParentApplicationId = parentApplicationId;
          let instanceSort = sort ?? 1;

          if (!instanceParentApplicationId) {
            const applicationToCreate: ApplicationModifyRequestRO = {
              // dataCollectionMode: 'on',
              alias: data.alias,
              type: 'SPRING_BOOT',
              parentFolderId: parentFolderId,
              sort: sort ?? 1,
              color: INHERITED_COLOR_VALUE,
            };

            const application = await createApplicationState.mutateAsync({
              entity: applicationCrudEntity,
              item: applicationToCreate,
            });

            instanceParentApplicationId = application.id;
            instanceSort = 1;
          }

          const instanceToCreate: InstanceModifyRequestRO = {
            // dataCollectionMode: 'inherited',
            alias: data.alias,
            actuatorUrl: data.actuatorUrl,
            dataCollectionIntervalSeconds: data.dataCollectionIntervalSeconds,
            parentApplicationId: instanceParentApplicationId,
            sort: instanceSort,
            color: INHERITED_COLOR_VALUE,
          };

          const result = await createInstanceState.mutateAsync({
            entity: instanceCrudEntity,
            item: instanceToCreate,
          });
          if (result) {
            onCreated?.(result);

            modal.resolve(result);
            modal.hide();
          }
        } catch (e) {}
      },
      [parentApplicationId, parentFolderId, sort, onCreated, modal, createApplicationState, createInstanceState]
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
