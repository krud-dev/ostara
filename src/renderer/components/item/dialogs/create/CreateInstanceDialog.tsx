import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';
import { useCrudCreate } from '../../../../apis/requests/crud/crudCreate';
import {
  ApplicationModifyRequestRO,
  ApplicationRO,
  InstanceModifyRequestRO,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { instanceCrudEntity } from '../../../../apis/requests/crud/entity/entities/instance.crudEntity';
import { INHERITED_COLOR_VALUE } from '../../../../hooks/useItemColor';
import { getActuatorUrls } from '../../../../utils/itemUtils';
import { useQueryClient } from '@tanstack/react-query';
import { crudKeys } from '../../../../apis/requests/crud/crudKeys';
import { useCrudCreateBulk } from '../../../../apis/requests/crud/crudCreateBulk';

export type CreateInstanceDialogProps = {
  parentApplicationId?: string;
  parentFolderId?: string;
  sort?: number;
  onCreated?: (item: InstanceRO[]) => void;
};

const CreateInstanceDialog: FunctionComponent<CreateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentApplicationId, parentFolderId, sort, onCreated }) => {
    const modal = useModal();
    const queryClient = useQueryClient();

    const createApplicationState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>({ refetchNone: true });
    const createBulkInstanceState = useCrudCreateBulk<InstanceRO, InstanceModifyRequestRO>({ refetchNone: true });

    const submitHandler = useCallback(
      async (data: InstanceFormValues & { multipleInstances: boolean }): Promise<void> => {
        try {
          let instanceParentApplicationId = parentApplicationId;
          let instanceSort = sort ?? 1;

          if (!instanceParentApplicationId) {
            const applicationToCreate: ApplicationModifyRequestRO = {
              // dataCollectionMode: 'on',
              alias: data.parentApplicationName || '',
              type: 'SPRING_BOOT',
              parentFolderId: parentFolderId,
              sort: sort ?? 1,
              color: INHERITED_COLOR_VALUE,
              authentication: { type: 'none' },
            };

            const application = await createApplicationState.mutateAsync({
              entity: applicationCrudEntity,
              item: applicationToCreate,
            });

            instanceParentApplicationId = application.id;
            instanceSort = 1;
          }

          const actuatorUrls = data.multipleInstances ? getActuatorUrls(data.actuatorUrl) : [data.actuatorUrl];
          const instancesToCreate = actuatorUrls.map<InstanceModifyRequestRO>((actuatorUrl, index) => ({
            // dataCollectionMode: 'inherited',
            alias: data.alias && actuatorUrls.length > 1 ? `${data.alias} (${index + 1})` : data.alias,
            actuatorUrl,
            parentApplicationId: instanceParentApplicationId!,
            sort: instanceSort + index,
            color: INHERITED_COLOR_VALUE,
            icon: data.icon,
          }));

          const result = await createBulkInstanceState.mutateAsync({
            entity: instanceCrudEntity,
            items: instancesToCreate,
          });
          if (result) {
            queryClient.invalidateQueries(crudKeys.entity(applicationCrudEntity));
            queryClient.invalidateQueries(crudKeys.entity(instanceCrudEntity));

            onCreated?.(result);

            modal.resolve(result);
            await modal.hide();
          }
        } catch (e) {}
      },
      [parentApplicationId, parentFolderId, sort, onCreated, modal, createApplicationState, createBulkInstanceState]
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
        <InstanceDetailsForm
          defaultValues={{ parentApplicationId: parentApplicationId }}
          onSubmit={submitHandler}
          onCancel={cancelHandler}
        />
      </Dialog>
    );
  }
);

export default CreateInstanceDialog;
