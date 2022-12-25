import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Application, Instance } from 'infra/configuration/model/configuration';
import { LoadingButton } from '@mui/lab';
import { useCreateApplication } from 'renderer/apis/configuration/application/createApplication';
import { useCreateInstance } from 'renderer/apis/configuration/instance/createInstance';
import { useGetActuatorUrlHealth } from 'renderer/apis/actuator/instance/getActuatorUrlHealth';
import { useSnackbar } from 'notistack';

export type CreateInstanceDialogProps = {
  parentApplicationId?: string;
  parentFolderId?: string;
  order?: number;
  onCreated?: (item: Instance) => void;
};

type FormValues = {
  alias: string;
  actuatorUrl: string;
};

const CreateInstanceDialog: FunctionComponent<CreateInstanceDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentApplicationId, parentFolderId, order, onCreated }) => {
    const modal = useModal();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();

    const { control, handleSubmit, watch } = useForm<FormValues>();

    const createApplicationState = useCreateApplication();
    const createInstanceState = useCreateInstance();

    const submitHandler = handleSubmit(async (data): Promise<void> => {
      try {
        let instanceParentApplicationId = parentApplicationId;
        let instanceOrder = order ?? 1;

        if (!instanceParentApplicationId) {
          const applicationToCreate: Omit<Application, 'id' | 'type'> = {
            dataCollectionMode: 'on',
            alias: data.alias,
            applicationType: 'SpringBoot',
            parentFolderId: parentFolderId,
            order: order ?? 1,
          };

          const application = await createApplicationState.mutateAsync({
            item: applicationToCreate,
          });

          instanceParentApplicationId = application.id;
          instanceOrder = 1;
        }

        const instanceToCreate: Omit<Instance, 'id' | 'type'> = {
          dataCollectionMode: 'on',
          alias: data.alias,
          actuatorUrl: data.actuatorUrl,
          parentApplicationId: instanceParentApplicationId,
          order: instanceOrder,
        };

        const result = await createInstanceState.mutateAsync({
          item: instanceToCreate,
        });
        if (result) {
          onCreated?.(result);

          modal.resolve(result);
          modal.hide();
        }
      } catch (e) {}
    });

    const cancelHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    const getActuatorHealthState = useGetActuatorUrlHealth();
    const actuatorUrl = watch('actuatorUrl');

    const testConnectionHandler = useCallback(async (): Promise<void> => {
      try {
        const result = await getActuatorHealthState.mutateAsync({ actuatorUrl });
        if (result.status === 'UP') {
          enqueueSnackbar(<FormattedMessage id="testConnectionToInstanceHealthy" />, { variant: 'success' });
        } else {
          enqueueSnackbar(<FormattedMessage id="testConnectionToInstanceUnhealthy" />, { variant: 'warning' });
        }
      } catch (e) {
        enqueueSnackbar(<FormattedMessage id="testConnectionToInstanceFailed" />, { variant: 'error' });
      }
    }, [getActuatorHealthState, actuatorUrl]);

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
        <DialogContent>
          <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
            <Controller
              name="alias"
              rules={{
                required: intl.formatMessage({ id: 'requiredField' }),
              }}
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    margin="normal"
                    required
                    fullWidth
                    label={<FormattedMessage id="name" />}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    error={invalid}
                    helperText={error?.message}
                  />
                );
              }}
            />
            <Controller
              name="actuatorUrl"
              rules={{
                required: intl.formatMessage({ id: 'requiredField' }),
              }}
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    margin="normal"
                    required
                    fullWidth
                    label={<FormattedMessage id="actuatorUrl" />}
                    type="url"
                    autoComplete="off"
                    error={invalid}
                    helperText={error?.message}
                    sx={{ mb: 0 }}
                  />
                );
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="text"
            color="primary"
            loading={getActuatorHealthState.isLoading}
            onClick={testConnectionHandler}
          >
            <FormattedMessage id={'testConnection'} />
          </LoadingButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" onClick={cancelHandler}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color="primary" onClick={submitHandler}>
            <FormattedMessage id={'create'} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);

export default CreateInstanceDialog;
