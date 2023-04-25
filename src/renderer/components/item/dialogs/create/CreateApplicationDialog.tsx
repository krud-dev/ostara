import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import ApplicationDetailsForm, {
  ApplicationFormValues,
} from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';
import { useCrudCreate } from '../../../../apis/requests/crud/crudCreate';
import { ApplicationModifyRequestRO, ApplicationRO } from '../../../../../common/generated_definitions';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { INHERITED_COLOR_VALUE } from '../../../../hooks/useItemColor';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';

export type CreateApplicationDialogProps = {
  parentFolderId?: string;
  sort?: number;
  onCreated?: (item: ApplicationRO) => void;
};

const CreateApplicationDialog: FunctionComponent<CreateApplicationDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, sort, onCreated }) => {
    const modal = useModal();
    const { track } = useAnalytics();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const createState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>();

    const submitHandler = useCallback(
      async (data: ApplicationFormValues): Promise<void> => {
        setSubmitting(true);

        const itemToCreate: ApplicationModifyRequestRO = {
          alias: data.alias,
          type: 'SPRING_BOOT',
          parentFolderId: parentFolderId,
          sort: sort ?? 1,
          color: data.color ?? INHERITED_COLOR_VALUE,
          icon: data.icon,
          authentication: data.authentication,
        };
        try {
          const result = await createState.mutateAsync({
            entity: applicationCrudEntity,
            item: itemToCreate,
          });
          if (result) {
            track({ name: 'add_application' });

            onCreated?.(result);

            modal.resolve(result);
            await modal.hide();
          }
        } catch (e) {
        } finally {
          setSubmitting(false);
        }
      },
      [parentFolderId, sort, onCreated, createState, modal]
    );

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
          <FormattedMessage id={'createApplication'} />
        </DialogTitleEnhanced>
        <ApplicationDetailsForm defaultValues={{ parentFolderId }} onSubmit={submitHandler} onCancel={cancelHandler} />
      </Dialog>
    );
  }
);

export default CreateApplicationDialog;
