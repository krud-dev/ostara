import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from '../../../../../components/dialog/DialogTitleEnhanced';
import { useExportAll } from '../../../../../apis/requests/backup/exportAll';
import { useAnalytics } from '../../../../../contexts/AnalyticsContext';

export type ExportConfigurationDialogProps = {};

const ExportConfigurationDialog: FunctionComponent<ExportConfigurationDialogProps & NiceModalHocProps> =
  NiceModal.create(({}) => {
    const modal = useModal();
    const { track } = useAnalytics();

    const exportState = useExportAll();

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
          <DialogTitleEnhanced onClose={cancelHandler}>
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
            <Button variant="outlined" color="inherit" onClick={cancelHandler}>
              <FormattedMessage id={'cancel'} />
            </Button>
            <Button variant="contained" color={'primary'} onClick={submitHandler}>
              <FormattedMessage id={'export'} />
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  });

export default ExportConfigurationDialog;
