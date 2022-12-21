import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import NiceModal, { NiceModalHocProps, useModal } from '@ebay/nice-modal-react';
import DialogTitleEnhanced from 'renderer/components/dialog/DialogTitleEnhanced';
import { CirclePicker, ColorResult } from 'react-color';

export type ChooseColorDialogProps = {
  defaultValue?: string;
  onSelected?: (value: string) => void;
};

const ChooseColorDialog: FunctionComponent<ChooseColorDialogProps & NiceModalHocProps> = NiceModal.create(
  ({ defaultValue, onSelected }) => {
    const modal = useModal();

    const changeHandler = useCallback(
      (color: ColorResult): void => {
        const selectedColor = color.hex;
        onSelected?.(selectedColor);

        modal.resolve(selectedColor);
        modal.hide();
      },
      [modal, onSelected]
    );

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
      >
        <DialogTitleEnhanced onClose={cancelHandler}>
          <FormattedMessage id={'chooseColor'} />
        </DialogTitleEnhanced>
        <DialogContent>
          <CirclePicker color={defaultValue} onChange={changeHandler} />
        </DialogContent>
      </Dialog>
    );
  }
);

export default ChooseColorDialog;
