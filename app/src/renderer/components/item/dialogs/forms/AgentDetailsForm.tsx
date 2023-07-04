import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Alert, Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';
import AuthenticationDetailsForm from 'renderer/components/item/authentication/forms/AuthenticationDetailsForm';
import { AgentModifyRequestRO, Authentication } from 'common/generated_definitions';
import useEffectiveAuthentication from 'renderer/components/item/authentication/hooks/useEffectiveAuthentication';
import EffectiveAuthenticationDetails from 'renderer/components/item/authentication/effective/EffectiveAuthenticationDetails';
import { URL_REGEX } from 'renderer/constants/regex';
import { useSnackbar } from 'notistack';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import { useGetAgentInfoByUrl } from 'renderer/apis/requests/agent/getAgentInfoByUrl';

export type AgentDetailsFormProps = {
  defaultValues?: Partial<AgentFormValues>;
  onSubmit: (data: AgentFormValues) => Promise<void>;
  onCancel: () => void;
};

export type AgentFormValues = AgentModifyRequestRO;

const AgentDetailsForm: FunctionComponent<AgentDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: AgentDetailsFormProps) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalyticsContext();

  const methods = useForm<AgentFormValues>({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    await onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [onCancel]);

  const authentication = useWatch<AgentFormValues>({
    control: control,
    name: 'authentication',
    defaultValue: defaultValues?.authentication,
  }) as Authentication | undefined;

  const effectiveAuthentication = useEffectiveAuthentication({
    folderId: defaultValues?.parentFolderId,
  });

  const url = watch('url');

  const apiKeyDisabled = useMemo<boolean>(() => !url?.startsWith('https'), [url]);

  useEffect(() => {
    if (apiKeyDisabled) {
      setValue('apiKey', '');
    }
  }, [apiKeyDisabled]);

  const testConnectionState = useGetAgentInfoByUrl({ disableGlobalError: true });

  const testConnectionHandler = useCallback(async (): Promise<void> => {
    track({ name: 'test_connection', properties: { item_type: 'instance' } });

    try {
      await testConnectionState.mutateAsync({ agentUrl: url });
      enqueueSnackbar(<FormattedMessage id="testConnectionToAgentSuccess" />, { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(<FormattedMessage id="testConnectionToAgentFailed" />, { variant: 'error' });
    }
  }, [testConnectionState, defaultValues, url]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={submitHandler} noValidate>
        <DialogContent>
          <Controller
            name="name"
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
                  label={<FormattedMessage id="name" />}
                  type="text"
                  autoComplete="off"
                  autoFocus
                  error={invalid}
                  helperText={error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ItemIconFormField type={'agent'} />
                      </InputAdornment>
                    ),
                  }}
                />
              );
            }}
          />

          <Controller
            name="url"
            rules={{
              required: intl.formatMessage({ id: 'requiredField' }),
              validate: (value) =>
                (!!value.trim() && URL_REGEX.test(value)) || intl.formatMessage({ id: 'invalidUrl' }),
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
                  label={<FormattedMessage id="url" />}
                  type="url"
                  autoComplete="off"
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />

          <Controller
            name="apiKey"
            rules={{
              required: apiKeyDisabled ? false : intl.formatMessage({ id: 'requiredField' }),
              validate: (value) =>
                apiKeyDisabled ? undefined : !!value?.trim() || intl.formatMessage({ id: 'requiredField' }),
            }}
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  required={!apiKeyDisabled}
                  disabled={apiKeyDisabled}
                  fullWidth
                  label={<FormattedMessage id="apiKey" />}
                  type="text"
                  autoComplete="off"
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />

          <Alert severity={'info'} variant={'outlined'} sx={{ mt: 2, mb: 1 }}>
            <FormattedMessage id="agentApiKeySecuredConnections" />
          </Alert>

          <AuthenticationDetailsForm itemType={'agent'} />

          <EffectiveAuthenticationDetails
            authentication={authentication}
            effectiveAuthentication={effectiveAuthentication}
          />
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

export default AgentDetailsForm;
