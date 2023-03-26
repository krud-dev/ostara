import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useTestConnectionByUrl } from 'renderer/apis/requests/actuator/testConnectionByUrl';
import { getErrorMessage } from 'renderer/utils/errorUtils';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';
import { URL_REGEX } from 'renderer/constants/regex';
import { IconViewer } from '../../../common/IconViewer';
import { getActuatorUrls } from '../../../../utils/itemUtils';
import AuthenticationDetailsForm from '../../authentication/forms/AuthenticationDetailsForm';
import { Authentication, InstanceModifyRequestRO } from '../../../../../common/generated_definitions';
import useEffectiveAuthentication from '../../authentication/hooks/useEffectiveAuthentication';
import EffectiveAuthenticationDetails from '../../authentication/effective/EffectiveAuthenticationDetails';
import { FolderFormValues } from './FolderDetailsForm';

export type InstanceDetailsFormProps = {
  defaultValues?: Partial<InstanceFormValues>;
  onSubmit: (data: InstanceFormValues & { multipleInstances: boolean }) => Promise<void>;
  onCancel: () => void;
};

export type InstanceFormValues = InstanceModifyRequestRO & {
  id?: string;
  parentApplicationName?: string;
  parentFolderId?: string;
  authentication?: Authentication;
};

const InstanceDetailsForm: FunctionComponent<InstanceDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: InstanceDetailsFormProps) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<InstanceFormValues>({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
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
  }, [onCancel]);

  const testConnectionState = useTestConnectionByUrl({ disableGlobalError: true });
  const actuatorUrl = useWatch<InstanceFormValues>({
    control: control,
    name: 'actuatorUrl',
    defaultValue: defaultValues?.actuatorUrl || '',
  }) as string;
  const authentication = useWatch<InstanceFormValues>({
    control: control,
    name: 'authentication',
    defaultValue: defaultValues?.authentication,
  }) as Authentication | undefined;

  const effectiveAuthentication = useEffectiveAuthentication({
    applicationId: defaultValues?.parentApplicationId,
    folderId: defaultValues?.parentFolderId,
  });

  const testConnectionHandler = useCallback(async (): Promise<void> => {
    try {
      const result = await testConnectionState.mutateAsync({
        actuatorUrl,
        authentication: effectiveAuthentication?.authentication,
      });
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
  }, [testConnectionState, actuatorUrl, effectiveAuthentication]);

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
            <>
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

              <AuthenticationDetailsForm />
            </>
          )}

          <EffectiveAuthenticationDetails
            authentication={authentication}
            effectiveAuthentication={effectiveAuthentication}
          />
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
