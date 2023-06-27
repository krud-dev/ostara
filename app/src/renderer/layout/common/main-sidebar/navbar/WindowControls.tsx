import { Button, Stack } from '@mui/material';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import { Theme } from '@mui/material/styles';
import { IconViewer, MUIconType } from '../../../../components/common/IconViewer';
import { SxProps } from '@mui/system';
import { useCallback } from 'react';
import { useMinimizeWindow } from '../../../../apis/requests/ui/minimizeWindow';
import { useMaximizeWindow } from '../../../../apis/requests/ui/maximizeWindow';
import { useCloseWindow } from '../../../../apis/requests/ui/closeWindow';

type WindowControlsProps = {
  sx?: SxProps<Theme>;
};

export default function WindowControls({ sx }: WindowControlsProps) {
  const minimizeWindowState = useMinimizeWindow();
  const minimizeHandler = useCallback((): void => {
    minimizeWindowState.mutate({});
  }, []);

  const maximizeWindowState = useMaximizeWindow();
  const maximizeHandler = useCallback((): void => {
    maximizeWindowState.mutate({});
  }, []);

  const closeWindowState = useCloseWindow();
  const closeHandler = useCallback((): void => {
    closeWindowState.mutate({});
  }, []);

  return (
    <Stack direction={'row'} sx={{ height: '100%', ...sx }}>
      <WindowControl icon={'MinimizeOutlined'} onClick={minimizeHandler} />
      <WindowControl icon={'CheckBoxOutlineBlankOutlined'} onClick={maximizeHandler} />
      <WindowControl icon={'CloseOutlined'} onClick={closeHandler} />
    </Stack>
  );
}

type WindowControlProps = { icon: MUIconType; onClick?: () => void };

function WindowControl({ icon, onClick }: WindowControlProps) {
  const { darkMode } = useSettingsContext();
  return (
    <Button
      color={darkMode ? 'lightGrey' : 'darkGrey'}
      onClick={onClick}
      sx={{ minWidth: 0, width: 39, height: '100%', display: 'inline-flex', p: 0, borderRadius: 0 }}
    >
      <IconViewer icon={icon} fontSize={'small'} />
    </Button>
  );
}
