import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useTestConnectionByUrl } from 'renderer/apis/requests/actuator/testConnectionByUrl';
import { getErrorMessage } from 'renderer/utils/errorUtils';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';
import { DIGITS_REGEX, URL_REGEX } from 'renderer/constants/regex';
import { IconViewer } from '../../../common/IconViewer';
import { getActuatorUrls } from '../../../../utils/itemUtils';

export type InstanceDetailsFormProps = {
  defaultValues?: Partial<InstanceFormValues>;
  onSubmit: (data: InstanceFormValues & { multipleInstances: boolean }) => Promise<void>;
  onCancel: () => void;
};

export type InstanceFormValues = {
  id?: string;
  alias?: string;
  icon?: string;
  actuatorUrl: string;
  dataCollectionIntervalSeconds: number;
  parentApplicationId?: string;
  parentApplicationName?: string;
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
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const [multipleInstances, setMultipleInstances] = useState<boolean>(false);

  const showMultipleInstancesToggle = useMemo<boolean>(() => !defaultValues?.id, [defaultValues]);

  const toggleMultipleInstances = useCallback((): void => {
    setMultipleInstances((prev) => !prev);
  }, [setMultipleInstances]);

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    await onSubmit?.({ ...data, multipleInstances });
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
      <Box component="form" onSubmit={submitHandler} noValidate>
        <DialogContent>
          <Controller
            name="actuatorUrl"
            rules={{
              required: intl.formatMessage({ id: 'requiredField' }),
              validate: (value) =>
                (!!value.trim() &&
                  (multipleInstances
                    ? getActuatorUrls(value).every((url) => URL_REGEX.test(url))
                    : URL_REGEX.test(value))) ||
                intl.formatMessage({ id: 'invalidUrl' }),
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
                  label={<FormattedMessage id={multipleInstances ? 'actuatorUrls' : 'actuatorUrl'} />}
                  placeholder={
                    multipleInstances
                      ? 'https://example1.dev/actuator\nhttps://example2.dev/actuator\nhttps://example3.dev/actuator'
                      : 'https://example.dev/actuator'
                  }
                  type="url"
                  autoComplete="off"
                  autoFocus
                  rows={5}
                  multiline={multipleInstances}
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />
          {showMultipleInstancesToggle && (
            <Button variant={'text'} size={'small'} onClick={toggleMultipleInstances}>
              <IconViewer
                icon={multipleInstances ? 'ControlPointOutlined' : 'ControlPointDuplicateOutlined'}
                fontSize={'small'}
                sx={{ mr: 1 }}
              />
              <FormattedMessage id={multipleInstances ? 'createSingleInstance' : 'createMultipleInstances'} />
            </Button>
          )}

          <Controller
            name="dataCollectionIntervalSeconds"
            rules={{
              required: intl.formatMessage({ id: 'requiredField' }),
              pattern: { value: DIGITS_REGEX, message: intl.formatMessage({ id: 'invalidNumber' }) },
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

          <Controller
            name="alias"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  fullWidth
                  label={<FormattedMessage id="alias" />}
                  type="text"
                  autoComplete="off"
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

          {!defaultValues?.parentApplicationId && (
            <Controller
              name="parentApplicationName"
              rules={{
                required: intl.formatMessage({ id: 'requiredField' }),
                validate: (value) => !!value?.trim() || intl.formatMessage({ id: 'requiredField' }),
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
                    label={<FormattedMessage id="applicationName" />}
                    type="text"
                    autoComplete="off"
                    error={invalid}
                    helperText={error?.message}
                  />
                );
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {!multipleInstances && (
            <LoadingButton
              variant="text"
              color="primary"
              loading={testConnectionState.isLoading}
              onClick={testConnectionHandler}
            >
              <FormattedMessage id={'testConnection'} />
            </LoadingButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" disabled={isSubmitting} onClick={cancelHandler}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color="primary" loading={isSubmitting} type={'submit'}>
            <FormattedMessage id={'save'} />
          </LoadingButton>
        </DialogActions>
      </Box>
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
