import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useTestConnectionByUrl } from 'renderer/apis/actuator/testConnectionByUrl';
import { getErrorMessage } from 'renderer/utils/errorUtils';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';

export type InstanceDetailsFormProps = {
  defaultValues?: InstanceFormValues;
  onSubmit: (data: InstanceFormValues) => Promise<void>;
  onCancel: () => void;
};

export type InstanceFormValues = {
  alias: string;
  icon?: string;
  actuatorUrl: string;
  dataCollectionIntervalSeconds: number;
};

const InstanceDetailsForm: FunctionComponent<InstanceDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: InstanceDetailsFormProps) => {
  const modal = useModal();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<InstanceFormValues>({ defaultValues });
  const { control, handleSubmit, watch } = methods;

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [modal]);

  const testConnectionState = useTestConnectionByUrl();
  const actuatorUrl = watch('actuatorUrl');

  const testConnectionHandler = useCallback(async (): Promise<void> => {
    try {
      const result = await testConnectionState.mutateAsync({ actuatorUrl });
      if (result.success) {
        enqueueSnackbar(<FormattedMessage id="testConnectionToInstanceSuccess" />, { variant: 'success' });
      } else {
        enqueueSnackbar(<TestConnectionError message={result.statusText} statusCode={result.statusCode} />, {
          variant: 'error',
        });
      }
    } catch (e) {
      enqueueSnackbar(<TestConnectionError message={getErrorMessage(e)} />, { variant: 'error' });
    }
  }, [testConnectionState, actuatorUrl]);

  return (
    <FormProvider {...methods}>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ItemIconFormField type={'instance'} />
                      </InputAdornment>
                    ),
                  }}
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
                />
              );
            }}
          />

          <Controller
            name="dataCollectionIntervalSeconds"
            rules={{
              required: intl.formatMessage({ id: 'requiredField' }),
            }}
            control={control}
            defaultValue={5}
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  required
                  fullWidth
                  label={<FormattedMessage id="dataCollectionIntervalSeconds" />}
                  type="number"
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
          loading={testConnectionState.isLoading}
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
    </FormProvider>
  );
};
export default InstanceDetailsForm;

type TestConnectionErrorProps = {
  message?: string;
  statusCode?: number;
};

const TestConnectionError: FunctionComponent<TestConnectionErrorProps> = ({
  message,
  statusCode,
}: TestConnectionErrorProps) => {
  return (
    <>
      <FormattedMessage id="testConnectionToInstanceFailed" />
      {'.'}
      {statusCode && (
        <>
          {' '}
          <FormattedMessage id={'statusCode'} />
          {`: ${statusCode}.`}
        </>
      )}
      {message && (
        <>
          {' '}
          <FormattedMessage id={'message'} />
          {`: ${message}.`}
        </>
      )}
    </>
  );
};
