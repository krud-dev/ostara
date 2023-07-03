import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, Divider, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useTestConnectionByUrl } from 'renderer/apis/requests/actuator/testConnectionByUrl';
import { getErrorMessage } from 'renderer/utils/errorUtils';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';
import { URL_REGEX } from 'renderer/constants/regex';
import { IconViewer } from '../../../common/IconViewer';
import { getActuatorUrls } from 'renderer/utils/itemUtils';
import AuthenticationDetailsForm from 'renderer/components/item/authentication/forms/AuthenticationDetailsForm';
import { ApplicationRO, Authentication, InstanceModifyRequestRO } from 'common/generated_definitions';
import useEffectiveAuthentication from 'renderer/components/item/authentication/hooks/useEffectiveAuthentication';
import EffectiveAuthenticationDetails from 'renderer/components/item/authentication/effective/EffectiveAuthenticationDetails';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import { useCrudShow } from 'renderer/apis/requests/crud/crudShow';
import { applicationCrudEntity } from 'renderer/apis/requests/crud/entity/entities/application.crudEntity';

export type InstanceDetailsFormProps = {
  defaultValues?: Partial<InstanceFormValues>;
  onSubmit: (data: InstanceFormValues) => Promise<void>;
  onCancel: () => void;
};

export type InstanceFormValues = InstanceModifyRequestRO & {
  id?: string;
  multipleInstances?: boolean;
  parentApplicationName?: string;
  disableSslVerification?: boolean;
  parentFolderId?: string;
  parentAgentId?: string;
  authentication?: Authentication;
};

const InstanceDetailsForm: FunctionComponent<InstanceDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: InstanceDetailsFormProps) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalyticsContext();

  const methods = useForm<InstanceFormValues>({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const showMultipleInstancesToggle = useMemo<boolean>(() => !defaultValues?.id, [defaultValues]);

  const actuatorUrl = useWatch<InstanceFormValues>({
    control: control,
    name: 'actuatorUrl',
    defaultValue: defaultValues?.actuatorUrl || '',
  }) as string;
  const disableSslVerification = useWatch<InstanceFormValues>({
    control: control,
    name: 'disableSslVerification',
    defaultValue: defaultValues?.disableSslVerification,
  }) as boolean | undefined;
  const authentication = useWatch<InstanceFormValues>({
    control: control,
    name: 'authentication',
    defaultValue: defaultValues?.authentication,
  }) as Authentication | undefined;
  const multipleInstances = useWatch<InstanceFormValues>({
    control: control,
    name: 'multipleInstances',
    defaultValue: defaultValues?.multipleInstances || false,
  }) as boolean;

  const effectiveAuthentication = useEffectiveAuthentication({
    applicationId: defaultValues?.parentApplicationId,
    agentId: defaultValues?.parentAgentId,
    folderId: defaultValues?.parentFolderId,
  });

  const toggleMultipleInstances = useCallback((): void => {
    setValue('multipleInstances', !multipleInstances);
  }, [setValue, multipleInstances]);

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    await onSubmit?.({ ...data });
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [onCancel]);

  const [loadingTestConnection, setLoadingTestConnection] = useState<boolean>(false);

  const testConnectionState = useTestConnectionByUrl({ disableGlobalError: true });
  const showApplicationState = useCrudShow<ApplicationRO>({ disableGlobalError: true });

  const testConnectionHandler = useCallback(async (): Promise<void> => {
    track({ name: 'test_connection', properties: { item_type: 'instance' } });

    setLoadingTestConnection(true);

    try {
      let effectiveDisableSslVerification = disableSslVerification;
      if (defaultValues?.parentApplicationId) {
        const parentApplication = await showApplicationState.mutateAsync({
          entity: applicationCrudEntity,
          id: defaultValues.parentApplicationId,
        });
        effectiveDisableSslVerification = parentApplication.disableSslVerification;
      }

      const result = await testConnectionState.mutateAsync({
        actuatorUrl,
        disableSslVerification: effectiveDisableSslVerification,
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
    } finally {
      setLoadingTestConnection(false);
    }
  }, [
    setLoadingTestConnection,
    showApplicationState,
    testConnectionState,
    defaultValues,
    actuatorUrl,
    disableSslVerification,
    effectiveAuthentication,
  ]);

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
                    endAdornment: (
                      <InputAdornment position="end">
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
              <Divider sx={{ mt: 2, mb: 1 }} />

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

              <Controller
                name="disableSslVerification"
                control={control}
                defaultValue={false}
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
                  return (
                    <TextField
                      {...field}
                      inputRef={ref}
                      margin="normal"
                      fullWidth
                      label={<FormattedMessage id="disableSslVerification" />}
                      select
                      error={invalid}
                      helperText={error?.message}
                    >
                      <MenuItem value={true as any}>
                        <FormattedMessage id="yes" />
                      </MenuItem>
                      <MenuItem value={false as any}>
                        <FormattedMessage id="no" />
                      </MenuItem>
                    </TextField>
                  );
                }}
              />

              <AuthenticationDetailsForm itemType={'instance'} />
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
              loading={loadingTestConnection}
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
