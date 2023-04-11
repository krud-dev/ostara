import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Box, DialogTitle, Stack } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import ToolbarButton, { ToolbarButtonProps } from '../common/ToolbarButton';

interface IProps extends PropsWithChildren<any> {
  disabled?: boolean;
  onClose?: () => void;
  buttons?: ToolbarButtonProps[];
  sx?: SxProps<Theme>;
}

const DialogTitleEnhanced: FunctionComponent<IProps> = ({ disabled, buttons, onClose, sx, children }) => {
  return (
    <>
      <DialogTitle noWrap sx={sx}>
        <Stack direction={'row'} spacing={0.5} sx={{ float: 'right' }}>
          {buttons?.map(({ disabled: actionDisabled, ...action }, index) => {
            const key = `${action.icon}-${index}`;
            const actionDisabledAggregated = actionDisabled || disabled;
            return <ToolbarButton {...action} disabled={actionDisabledAggregated} key={key} />;
          })}
          {onClose ? (
            <ToolbarButton tooltipLabelId={'close'} icon={'CloseOutlined'} disabled={disabled} onClick={onClose} />
          ) : null}
        </Stack>

        <Box sx={{ display: 'inline', lineHeight: 2.1 }}>{children}</Box>
      </DialogTitle>
      <div />
    </>
  );
};
export default DialogTitleEnhanced;
