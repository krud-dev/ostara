import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import DialogTitleEnhanced from './DialogTitleEnhanced';
import { FormattedMessage, useIntl } from 'react-intl';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';

export type PasswordDialogProps = {
  title: ReactNode;
  text: ReactNode;
  continueText?: ReactNode;
  cancelText?: ReactNode;
  onPassword?: (password: string) => void;
  onPasswordDismissed?: () => void;
};

type FormValues = {
  password: string;
};

const PasswordDialog: FunctionComponent<PasswordDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ title, text, continueText, cancelText, onPassword, onPasswordDismissed }) => {
    const modal = useModal();
    const intl = useIntl();

    const { control, handleSubmit } = useForm<FormValues>();

    const submitHandler = handleSubmit((data): void => {
      onPassword?.(data.password);

      modal.resolve(data.password);
      modal.hide();
    });

    const cancelHandler = useCallback((): void => {
      onPasswordDismissed?.();

      modal.resolve(false);
      modal.hide();
    }, [onPasswordDismissed, modal]);

    return (
      <Dialog
        open={modal.visible}
        onClose={cancelHandler}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
      >
        <DialogTitleEnhanced onClose={cancelHandler}>{title}</DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>

          <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
            <Controller
              name="password"
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
                    label={<FormattedMessage id="password" />}
                    type="password"
                    autoComplete="off"
                    autoFocus
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
          <Button variant="outlined" color="primary" onClick={cancelHandler}>
            {cancelText || <FormattedMessage id={'cancel'} />}
          </Button>
          <Button variant="contained" color="primary" onClick={submitHandler}>
            {continueText || <FormattedMessage id={'continue'} />}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default PasswordDialog;
