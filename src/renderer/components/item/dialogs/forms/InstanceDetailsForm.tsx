import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import { LoadingButton } from '@mui/lab';
import { useGetActuatorUrlHealth } from 'renderer/apis/actuator/instance/getActuatorUrlHealth';
import { useSnackbar } from 'notistack';

export type InstanceDetailsFormProps = {
  defaultValues?: InstanceFormValues;
  onSubmit: (data: InstanceFormValues) => Promise<void>;
  onCancel: () => void;
};

export type InstanceFormValues = {
  alias: string;
  actuatorUrl: string;
};

const InstanceDetailsForm: FunctionComponent<InstanceDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: InstanceDetailsFormProps) => {
  const modal = useModal();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, watch } = useForm<InstanceFormValues>({ defaultValues });

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
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
    <>
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
          <FormattedMessage id={'save'} />
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default InstanceDetailsForm;
