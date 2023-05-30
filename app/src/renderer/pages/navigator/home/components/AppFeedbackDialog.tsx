import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import { useSendFeedback } from '../../../../apis/requests/feedback/sendFeedback';
import { LoadingButton } from '@mui/lab';
import DialogTitleEnhanced from '../../../../components/dialog/DialogTitleEnhanced';
import { useSnackbar } from 'notistack';
import { useAnalytics } from '../../../../contexts/AnalyticsContext';

export type AppFeedbackDialogProps = {};

type FormValues = {
  text: string;
  email: string;
};

const AppFeedbackDialog: FunctionComponent<AppFeedbackDialogProps & NiceModalHocProps> = NiceModal.create(({}) => {
  const modal = useModal();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalytics();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const sendFeedbackState = useSendFeedback();

  useEffect(() => {
    track({ name: 'send_feedback_dialog_open' });
  }, []);

  const submitHandler = handleSubmit(async (data): Promise<void> => {
    track({ name: 'send_feedback_dialog_submit' });

    try {
      await sendFeedbackState.mutateAsync(data);

      enqueueSnackbar(<FormattedMessage id={'sendFeedbackSuccess'} />, { variant: 'success' });

      track({ name: 'send_feedback_dialog_success' });

      modal.resolve(true);
      modal.hide();
    } catch (e) {}
  });

  const cancelHandler = useCallback((): void => {
    if (isSubmitting) {
      return;
    }
    modal.resolve(false);
    modal.hide();
  }, [modal, isSubmitting]);

  return (
    <Dialog
      open={modal.visible}
      onClose={cancelHandler}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
    >
      <DialogTitleEnhanced onClose={cancelHandler} disabled={isSubmitting}>
        <FormattedMessage id={'sendFeedback'} />
      </DialogTitleEnhanced>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id={'sendFeedbackDescription'} />
        </DialogContentText>

        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
          <Controller
            name="text"
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
                  label={<FormattedMessage id="feedback" />}
                  type="text"
                  autoComplete="off"
                  autoFocus
                  rows={5}
                  multiline
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => {
              return (
                <TextField
                  {...field}
                  inputRef={ref}
                  margin="normal"
                  fullWidth
                  label={<FormattedMessage id="email" />}
                  type="email"
                  autoComplete="off"
                  error={invalid}
                  helperText={error?.message}
                />
              );
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={cancelHandler} disabled={isSubmitting}>
          <FormattedMessage id={'cancel'} />
        </Button>
        <LoadingButton variant="contained" color="primary" onClick={submitHandler} loading={isSubmitting}>
          <FormattedMessage id={'send'} />
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
});

export default AppFeedbackDialog;
