import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Box, Dialog } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import InstanceDetailsForm, { InstanceFormValues } from 'renderer/components/item/dialogs/forms/InstanceDetailsForm';
import { useCrudCreate } from 'renderer/apis/requests/crud/crudCreate';
import {
  ApplicationModifyRequestRO,
  ApplicationRO,
  InstanceModifyRequestRO,
  InstanceRO,
} from 'common/generated_definitions';
import { applicationCrudEntity } from 'renderer/apis/requests/crud/entity/entities/application.crudEntity';
import { instanceCrudEntity } from 'renderer/apis/requests/crud/entity/entities/instance.crudEntity';
import { INHERITED_COLOR_VALUE } from 'renderer/hooks/useItemColor';
import { getActuatorUrls, getItemUrl } from 'renderer/utils/itemUtils';
import { useQueryClient } from '@tanstack/react-query';
import { crudKeys } from 'renderer/apis/requests/crud/crudKeys';
import { useCrudCreateBulk } from 'renderer/apis/requests/crud/crudCreateBulk';
import LogoLoader from 'renderer/components/common/LogoLoader';
import { every } from 'lodash';
import { URL_REGEX } from 'renderer/constants/regex';
import { useAnalytics } from 'renderer/contexts/AnalyticsContext';
import { useNavigate } from 'react-router-dom';
import { useItems } from 'renderer/contexts/ItemsContext';

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
    const { track } = useAnalytics();
    const { addItems } = useItems();
    const navigate = useNavigate();

    const [defaultValues, setDefaultValues] = useState<Partial<InstanceFormValues> | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
      (async () => {
        const clipboard = await window.utils.readClipboardText();
        const actuatorUrls = getActuatorUrls(clipboard);
        const defaultActuatorUrl = every(actuatorUrls, (url) => URL_REGEX.test(url))
          ? actuatorUrls.join('\n')
          : undefined;
        const multipleInstances = !!defaultActuatorUrl && actuatorUrls.length > 1;
        setDefaultValues({ parentApplicationId, parentFolderId, actuatorUrl: defaultActuatorUrl, multipleInstances });
      })();
    }, []);

    const createApplicationState = useCrudCreate<ApplicationRO, ApplicationModifyRequestRO>({ refetchNone: true });
    const createBulkInstanceState = useCrudCreateBulk<InstanceRO, InstanceModifyRequestRO>({ refetchNone: true });

    const submitHandler = useCallback(
      async (data: InstanceFormValues): Promise<void> => {
        setSubmitting(true);

        try {
          let instanceParentApplication: ApplicationRO | undefined;
          let instanceParentApplicationId = parentApplicationId;
          let instanceSort = sort ?? 1;

          if (!instanceParentApplicationId) {
            const applicationToCreate: ApplicationModifyRequestRO = {
              alias: data.parentApplicationName || '',
              type: 'SPRING_BOOT',
              parentFolderId: parentFolderId,
              sort: sort ?? 1,
              color: data.color ?? INHERITED_COLOR_VALUE,
              disableSslVerification: data.disableSslVerification,
              authentication: data.authentication || { type: 'inherit' },
            };

            instanceParentApplication = await createApplicationState.mutateAsync({
              entity: applicationCrudEntity,
              item: applicationToCreate,
            });

            instanceParentApplicationId = instanceParentApplication.id;
            instanceSort = 1;
          }

          const actuatorUrls = data.multipleInstances ? getActuatorUrls(data.actuatorUrl) : [data.actuatorUrl];
          const instancesToCreate = actuatorUrls.map<InstanceModifyRequestRO>((actuatorUrl, index) => ({
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
          if (result?.length) {
            queryClient.invalidateQueries(crudKeys.entity(applicationCrudEntity));
            queryClient.invalidateQueries(crudKeys.entity(instanceCrudEntity));

            track({ name: 'add_instance', properties: { count: instancesToCreate.length } });

            addItems([...(instanceParentApplication ? [instanceParentApplication] : []), ...result]);
            navigate(getItemUrl(result[0]));

            onCreated?.(result);

            modal.resolve(result);
            await modal.hide();
          }
        } catch (e) {
        } finally {
          setSubmitting(false);
        }
      },
      [parentApplicationId, parentFolderId, sort, onCreated, modal, createApplicationState, createBulkInstanceState]
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
          <FormattedMessage id={'createInstance'} />
        </DialogTitleEnhanced>
        {!defaultValues ? (
          <Box sx={{ textAlign: 'center' }}>
            <LogoLoader />
          </Box>
        ) : (
          <InstanceDetailsForm defaultValues={defaultValues} onSubmit={submitHandler} onCancel={cancelHandler} />
        )}
      </Dialog>
    );
  }
);

export default CreateInstanceDialog;
