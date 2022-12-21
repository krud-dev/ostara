import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { Application } from 'infra/configuration/model/configuration';
import { LoadingButton } from '@mui/lab';
import { useCreateApplication } from 'renderer/apis/configuration/application/createApplication';

export type CreateFolderDialogProps = {
  parentFolderId?: string;
  order?: number;
  onCreated?: (item: Application) => void;
};

type FormValues = {
  alias: string;
};

const CreateFolderDialog: FunctionComponent<CreateFolderDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ parentFolderId, order, onCreated }) => {
    const modal = useModal();
    const intl = useIntl();

    const { control, handleSubmit } = useForm<FormValues>();

    const createState = useCreateApplication();

    const submitHandler = handleSubmit(async (data): Promise<void> => {
      const itemToCreate: Omit<Application, 'id' | 'type'> = {
        alias: data.alias,
        applicationType: 'SpringBoot',
        parentFolderId: parentFolderId,
        order: order ?? 1,
      };
      try {
        const result = await createState.mutateAsync({
          item: itemToCreate,
        });
        if (result) {
          onCreated?.(result);

          modal.resolve(result);
          modal.hide();
        }
      } catch (e) {}
    });

    const cancelHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    return (
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
          <FormattedMessage id={'createApplication'} />
        </DialogTitleEnhanced>
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
                    sx={{ mb: 0 }}
                  />
                );
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={cancelHandler}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color="primary" onClick={submitHandler}>
            <FormattedMessage id={'create'} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);

export default CreateFolderDialog;
