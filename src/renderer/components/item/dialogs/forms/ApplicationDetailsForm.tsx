import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import { LoadingButton } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';

export type ApplicationDetailsFormProps = {
  defaultValues?: ApplicationFormValues;
  onSubmit: (data: ApplicationFormValues) => Promise<void>;
  onCancel: () => void;
};

export type ApplicationFormValues = {
  alias: string;
  icon?: string;
};

const ApplicationDetailsForm: FunctionComponent<ApplicationDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: ApplicationDetailsFormProps) => {
  const modal = useModal();
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
  }, [modal]);

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
                    startAdornment: (
                      <InputAdornment position="start">
                        <ItemIconFormField type={'application'} />
                      </InputAdornment>
                    ),
                  }}
                />
              );
            }}
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
