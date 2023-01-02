import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { useModal } from '@ebay/nice-modal-react';
import { LoadingButton } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import { ApplicationFormValues } from 'renderer/components/item/dialogs/forms/ApplicationDetailsForm';
import ItemIconFormField from 'renderer/components/item/dialogs/forms/fields/ItemIconFormField';

export type FolderDetailsFormProps = {
  defaultValues?: FolderFormValues;
  onSubmit: (data: FolderFormValues) => Promise<void>;
  onCancel: () => void;
};

export type FolderFormValues = {
  alias: string;
  icon?: string;
};

const FolderDetailsForm: FunctionComponent<FolderDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}: FolderDetailsFormProps) => {
  const modal = useModal();
  const intl = useIntl();

  const methods = useForm<FolderFormValues>({ defaultValues });
  const { control, handleSubmit } = methods;

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    onSubmit?.(data);
  });

  const cancelHandler = useCallback((): void => {
    onCancel();
  }, [modal]);

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
                        <ItemIconFormField type={'folder'} />
                      </InputAdornment>
                    ),
                  }}
                />
              );
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
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

export default FolderDetailsForm;
