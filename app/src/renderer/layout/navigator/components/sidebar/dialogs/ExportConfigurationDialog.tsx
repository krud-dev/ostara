import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { useExportBackup } from 'renderer/apis/requests/backup/exportBackup';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import { LoadingButton } from '@mui/lab';

export type ExportConfigurationDialogProps = {} & NiceModalHocProps;

const ExportConfigurationDialog: FunctionComponent<ExportConfigurationDialogProps> = NiceModal.create(({}) => {
  const modal = useModal();
  const { track } = useAnalyticsContext();

  const exportState = useExportBackup();

  const submitHandler = useCallback(async (): Promise<void> => {
    track({ name: 'export_all_submit' });

    try {
      await exportState.mutateAsync({});

      modal.resolve(true);
      modal.hide();
    } catch (e) {}
  }, [track, exportState, modal]);

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
        <DialogTitleEnhanced onClose={cancelHandler} disabled={exportState.isLoading}>
          <FormattedMessage id={'exportConfiguration'} />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            <FormattedMessage id={'exportConfigurationDescription'} />
          </DialogContentText>
          <Alert severity={'warning'} variant={'outlined'}>
            <FormattedMessage id="exportConfigurationAuthenticationWarning" />
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={cancelHandler} disabled={exportState.isLoading}>
            <FormattedMessage id={'cancel'} />
          </Button>
          <LoadingButton variant="contained" color={'primary'} onClick={submitHandler} loading={exportState.isLoading}>
            <FormattedMessage id={'export'} />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ExportConfigurationDialog;
