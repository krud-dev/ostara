import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import { useSnackbar } from 'notistack';
import { SystemBackupRO } from 'common/generated_definitions';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { useRestoreSystemBackup } from 'renderer/apis/requests/system-backup/restoreSystemBackup';
import { LoadingButton } from '@mui/lab';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import NavigatorTreePreviewCard from 'renderer/layout/navigator/components/sidebar/tree/cards/NavigatorTreePreviewCard';
import { useShowSystemBackupQuery } from 'renderer/apis/requests/system-backup/showSystemBackup';

export type RestoreBackupDialogProps = {
  systemBackup: SystemBackupRO;
} & NiceModalHocProps;

const RestoreBackupDialog: FunctionComponent<RestoreBackupDialogProps> = NiceModal.create(({ systemBackup }) => {
  const modal = useModal();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalyticsContext();

  const restoreState = useRestoreSystemBackup();
  const previewState = useShowSystemBackupQuery({ fileName: systemBackup.fileName });

  const submitHandler = useCallback(async (): Promise<void> => {
    track({ name: 'restore_backup_submit' });

    try {
      await restoreState.mutateAsync({ fileName: systemBackup.fileName });

      enqueueSnackbar(<FormattedMessage id={'backupRestoredSuccessfully'} />, { variant: 'success' });

      modal.resolve(true);
      modal.hide();
    } catch (e) {}
  }, [systemBackup, track, restoreState, modal]);

  const cancelHandler = useCallback((): void => {
    modal.resolve(false);
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
        <DialogTitleEnhanced onClose={cancelHandler} disabled={restoreState.isLoading}>
          <FormattedMessage id={'restoreBackup'} />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage
              id={'restoreBackupDescription'}
              values={{
                fileName: (
                  <Box component={'span'} sx={{ color: 'text.primary' }}>
                    {systemBackup.fileName}
                  </Box>
                ),
                time: (
                  <Box component={'span'} sx={{ color: 'text.primary' }}>
                    <FormattedDateAndRelativeTime value={systemBackup.date} />
                  </Box>
                ),
              }}
            />
          </DialogContentText>

          <Alert severity={'error'} variant={'outlined'} sx={{ mt: 3 }}>
            <FormattedMessage id="restoreBackupDeleteWarning" />
          </Alert>

          <NavigatorTreePreviewCard backup={previewState.data} sx={{ mt: 3 }} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={cancelHandler} disabled={restoreState.isLoading}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color={'primary'} onClick={submitHandler} loading={restoreState.isLoading}>
            <FormattedMessage id={'restore'} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default RestoreBackupDialog;
