import React, { FunctionComponent, PropsWithChildren } from 'react';
import { DialogTitle, IconButton } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { CloseOutlined } from '@mui/icons-material';

interface IProps extends PropsWithChildren<any> {
  disabled?: boolean;
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

const DialogTitleEnhanced: FunctionComponent<IProps> = ({ disabled, onClose, sx, children }) => {
  return (
    <>
      <DialogTitle noWrap sx={sx}>
        {onClose ? (
          <IconButton aria-label="close" size="small" disabled={disabled} onClick={onClose} sx={{ float: 'right' }}>
            <CloseOutlined />
          </IconButton>
        ) : null}

        {children}
      </DialogTitle>
      <div />
    </>
  );
};
export default DialogTitleEnhanced;
