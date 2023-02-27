import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import DialogTitleEnhanced from './DialogTitleEnhanced';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import { ColorSchema } from 'renderer/theme/config/palette';

export type ConfirmationDialogProps = {
  title: ReactNode;
  text: ReactNode;
  continueText?: ReactNode;
  continueColor?: ColorSchema;
  cancelText?: ReactNode;
  onConfirm?: () => void;
};

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ title, text, continueText, continueColor, cancelText, onConfirm }) => {
    const modal = useModal();

    const confirmHandler = useCallback((): void => {
      onConfirm?.();

      modal.resolve(true);
      modal.hide();
    }, [onConfirm, modal]);

    const cancelHandler = useCallback((): void => {
      modal.resolve(false);
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
        <DialogTitleEnhanced onClose={cancelHandler}>{title}</DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color={'inherit'} onClick={cancelHandler}>
            {cancelText || <FormattedMessage id={'cancel'} />}
          </Button>
          <Button variant="contained" color={continueColor || 'inherit'} onClick={confirmHandler} autoFocus>
            {continueText || <FormattedMessage id={'continue'} />}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ConfirmationDialog;
