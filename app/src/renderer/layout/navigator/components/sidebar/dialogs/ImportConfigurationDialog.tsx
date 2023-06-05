import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from '../../../../../components/dialog/DialogTitleEnhanced';
import { useAnalytics } from '../../../../../contexts/AnalyticsContext';
import { useImportAll } from '../../../../../apis/requests/backup/importAll';
import UploadSingleFile from '../../../../../components/upload/UploadSingleFile';
import { isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';

export type ExportConfigurationDialogProps = {};

const ImportConfigurationDialog: FunctionComponent<ExportConfigurationDialogProps & NiceModalHocProps> =
  NiceModal.create(({}) => {
    const modal = useModal();
    const { enqueueSnackbar } = useSnackbar();
    const { track } = useAnalytics();

    const [file, setFile] = useState<File | undefined>(undefined);
    const [jsonData, setJsonData] = useState<string | undefined>(undefined);

    const importState = useImportAll();

    const submitHandler = useCallback(async (): Promise<void> => {
      if (!jsonData) {
        enqueueSnackbar(<FormattedMessage id={'selectFileToImport'} />, { variant: 'error' });
        return;
      }

      track({ name: 'import_all_submit' });

      try {
        await importState.mutateAsync({ jsonData });
      } catch (e) {
        return;
      }

      modal.resolve(true);
      modal.hide();
    }, [jsonData, track, importState, modal]);

    const cancelHandler = useCallback((): void => {
      modal.resolve(false);
      modal.hide();
    }, [modal]);

    const filesAcceptedHandler = useCallback(
      (files: File[]): void => {
        setJsonData(undefined);

        if (isEmpty(files)) {
          setFile(undefined);
        } else {
          setFile(files[0]);
        }
      },
      [setJsonData, setFile]
    );

    const filesRejectedHandler = useCallback((): void => {
      setJsonData(undefined);
      setFile(undefined);
    }, [setFile]);

    useEffect(() => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (content) {
            setJsonData(content.toString());
          }
        };
        reader.readAsText(file);
      } else {
        setJsonData(undefined);
      }
    }, [file]);

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
            <FormattedMessage id={'importConfiguration'} />
          </DialogTitleEnhanced>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              <FormattedMessage id={'importConfigurationDescription'} />
            </DialogContentText>

            <UploadSingleFile
              accept={{
                'application/json': ['.json'],
              }}
              file={file}
              onDropAccepted={filesAcceptedHandler}
              onDropRejected={filesRejectedHandler}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={cancelHandler}>
              <FormattedMessage id={'cancel'} />
            </Button>
            <Button variant="contained" color={'primary'} onClick={submitHandler}>
              <FormattedMessage id={'import'} />
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  });

export default ImportConfigurationDialog;
