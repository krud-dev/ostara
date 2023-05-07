import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from '../../dialog/DialogTitleEnhanced';

export type CustomLogLevelDialogProps = {
  onUpdate?: (logLevel: string) => void;
};

type FormValues = {
  logLevel: string;
};

const CustomLogLevelDialog: FunctionComponent<CustomLogLevelDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ onUpdate }) => {
    const modal = useModal();
    const intl = useIntl();

    const { control, handleSubmit } = useForm<FormValues>();

    const submitHandler = handleSubmit((data): void => {
      onUpdate?.(data.logLevel);

      modal.resolve(data.logLevel);
      modal.hide();
    });

    const cancelHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    return (
      <>
        <Dialog
          open={modal.visible}
          onClose={cancelHandler}
          TransitionProps={{
            onExited: () => modal.remove(),
          }}
          fullWidth
          maxWidth={'xs'}
        >
          <DialogTitleEnhanced onClose={cancelHandler}>
            <FormattedMessage id={'enterCustomLogLevel'} />
          </DialogTitleEnhanced>
          <DialogContent>
            <Box component="form" onSubmit={submitHandler} noValidate>
              <Controller
                name="logLevel"
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
                      label={<FormattedMessage id="logLevel" />}
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
            <Button variant="outlined" color="inherit" onClick={cancelHandler}>
              <FormattedMessage id={'cancel'} />
            </Button>
            <Button variant="contained" color={'primary'} onClick={submitHandler}>
              <FormattedMessage id={'continue'} />
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default CustomLogLevelDialog;
