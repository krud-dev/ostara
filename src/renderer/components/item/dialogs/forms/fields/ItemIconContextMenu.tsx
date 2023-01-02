import { Box, ToggleButton } from '@mui/material';
import ContextMenuPopper from 'renderer/components/menu/popup/ContextMenuPopper';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconViewer, MUIconType } from 'renderer/components/icon/IconViewer';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { availableItemIcons } from 'renderer/constants/icons';

type ItemIconContextMenuProps = {
  typeIcon: MUIconType;
  selectedIcon: MUIconType;
  open: boolean;
  anchorEl?: Element | null;
  onClose?: () => void;
  onSelected?: (icon: MUIconType) => void;
  sx?: SxProps<Theme>;
};

export default function ItemIconContextMenu({
  typeIcon,
  selectedIcon,
  open,
  anchorEl,
  onClose,
  onSelected,
  sx,
}: ItemIconContextMenuProps) {
  const availableIcons = useMemo<MUIconType[]>(() => [typeIcon, ...availableItemIcons], [typeIcon]);

  const selectedHandler = useCallback(
    (icon: MUIconType): void => {
      onClose?.();
      onSelected?.(icon);
    },
    [onSelected, onClose]
  );

  return (
    <ContextMenuPopper open={open} onClose={onClose} anchorEl={anchorEl} sx={{ p: 0, ...sx }}>
      <Box sx={{ width: 244, height: 192, overflow: 'hidden' }}>
        <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
          <Box sx={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, p: 2 }}>
            {availableIcons.map((icon) => {
              const selected = icon === selectedIcon;
              return (
                <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', minWidth: 0 }} key={icon}>
                  <ToggleButton selected={selected} size={'small'} value={icon} onClick={() => selectedHandler(icon)}>
                    <IconViewer icon={icon} fontSize={'small'} />
                  </ToggleButton>
                </Box>
              );
            })}
          </Box>
        </PerfectScrollbar>
      </Box>
    </ContextMenuPopper>
  );
}
