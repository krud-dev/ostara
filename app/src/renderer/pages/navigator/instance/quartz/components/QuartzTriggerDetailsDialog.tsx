import React, { FunctionComponent, useCallback } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { EnrichedQuartzTrigger } from 'renderer/apis/requests/instance/quartz/getInstanceQuartzTriggers';
import QuartzTriggerDetails from 'renderer/pages/navigator/instance/quartz/components/QuartzTriggerDetails';

export type QuartzTriggerDetailsDialogProps = {
  trigger: EnrichedQuartzTrigger;
} & NiceModalHocProps;

const QuartzTriggerDetailsDialog: FunctionComponent<QuartzTriggerDetailsDialogProps> = NiceModal.create(
  ({ trigger }) => {
    const modal = useModal();

    const closeHandler = useCallback((): void => {
      modal.resolve(undefined);
      modal.hide();
    }, [modal]);

    return (
      <Dialog
        open={modal.visible}
        onClose={closeHandler}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
        fullWidth
        maxWidth={'lg'}
      >
        <DialogTitleEnhanced onClose={closeHandler}>{trigger.name}</DialogTitleEnhanced>
        <DialogContent>
          <QuartzTriggerDetails row={trigger} sx={{ my: 0 }} />
        </DialogContent>
      </Dialog>
    );
  }
);

export default QuartzTriggerDetailsDialog;
