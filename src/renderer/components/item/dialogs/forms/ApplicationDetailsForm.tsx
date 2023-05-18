import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';
import AuthenticationDetailsForm from '../../authentication/forms/AuthenticationDetailsForm';
import { ApplicationModifyRequestRO, Authentication } from '../../../../../common/generated_definitions';
import useEffectiveAuthentication from '../../authentication/hooks/useEffectiveAuthentication';
import EffectiveAuthenticationDetails from '../../authentication/effective/EffectiveAuthenticationDetails';

export type ApplicationDetailsFormProps = {
  defaultValues?: Partial<ApplicationFormValues>;
  onSubmit: (data: ApplicationFormValues) => Promise<void>;
  onCancel: () => void;
};

export type ApplicationFormValues = ApplicationModifyRequestRO & {
  id?: string;
};

const ApplicationDetailsForm: FunctionComponent<ApplicationDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: ApplicationDetailsFormProps) => {
  const intl = useIntl();

  const methods = useForm<ApplicationFormValues>({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    await onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [onCancel]);

  const authentication = useWatch<ApplicationFormValues>({
    control: control,
    name: 'authentication',
    defaultValue: defaultValues?.authentication,
  }) as Authentication | undefined;

  const effectiveAuthentication = useEffectiveAuthentication({
    folderId: defaultValues?.parentFolderId,
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={submitHandler} noValidate>
        <DialogContent>
          <Controller
            name="alias"
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
                        <ItemIconFormField type={'application'} />
                      </InputAdornment>
                    ),
                  }}
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

          <AuthenticationDetailsForm itemType={'application'} />

          <EffectiveAuthenticationDetails
            authentication={authentication}
            effectiveAuthentication={effectiveAuthentication}
          />
        </DialogContent>
        <DialogActions>
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

export default ApplicationDetailsForm;
