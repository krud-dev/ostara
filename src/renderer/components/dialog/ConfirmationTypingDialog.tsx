import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import DialogTitleEnhanced from './DialogTitleEnhanced';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';

export type ConfirmationTypingDialogProps = {
  title: ReactNode;
  text: ReactNode;
  continueText?: ReactNode;
  cancelText?: ReactNode;
  confirmText: string;
  onConfirm?: () => void;
};

type FormValues = {
  confirm: string;
};

const ConfirmationTypingDialog: FunctionComponent<
  ConfirmationTypingDialogProps & NiceModalHocProps
> = NiceModal.create(
  ({ title, text, continueText, cancelText, confirmText, onConfirm }) => {
    const modal = useModal();
    const intl = useIntl();

    const { control, handleSubmit } = useForm<FormValues>();

    const submitHandler = handleSubmit((data): void => {
      onConfirm?.();

      modal.resolve(true);
      modal.hide();
    });

    const cancelHandler = useCallback((): void => {
      modal.resolve(false);
      modal.hide();
    }, [modal]);

    const validateContains = useCallback(
      (value: string, textToContain: string): string | undefined => {
        if (!textToContain) {
          return undefined;
        }
        if (!value) {
          return intl.formatMessage({ id: 'requiredField' });
        }
        if (value.toLowerCase().indexOf(textToContain.toLowerCase()) < 0) {
          return intl
            .formatMessage({ id: 'typeToConfirm' })
            .replace('{confirm}', textToContain);
        }
        return undefined;
      },
      []
    );

    return (
      <>
        <Dialog
          open={modal.visible}
          onClose={cancelHandler}
          TransitionProps={{
            onExited: () => modal.remove(),
          }}
        >
          <DialogTitleEnhanced onClose={cancelHandler}>
            {title}
          </DialogTitleEnhanced>
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>

            <Box
              component="form"
              onSubmit={submitHandler}
              noValidate
              sx={{ mt: 1 }}
            >
              <Controller
                name="confirm"
                rules={{
                  required: intl.formatMessage({ id: 'requiredField' }),
                  validate: (data) => validateContains(data, confirmText),
                }}
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error },
                }) => {
                  return (
                    <TextField
                      {...field}
                      inputRef={ref}
                      margin="normal"
                      required
                      fullWidth
                      label={
                        <FormattedMessage
                          id="typeToConfirm"
                          values={{ confirm: confirmText }}
                        />
                      }
                      type="text"
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
      </>
    );
  }
);

export default ConfirmationTypingDialog;
