import { Box, ToggleButton } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconViewer, MUIconType } from 'renderer/components/icon/IconViewer';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { availableItemIcons } from 'renderer/constants/icons';
import { bindMenu, PopupState } from 'material-ui-popup-state/hooks';
import MenuPopover from 'renderer/components/menu/popup/MenuPopover';

type ItemIconMenuProps = {
  typeIcon: MUIconType;
  selectedIcon: MUIconType;
  onSelected?: (icon: MUIconType) => void;
  menuState: PopupState;
};

export default function ItemIconMenu({ typeIcon, selectedIcon, onSelected, menuState }: ItemIconMenuProps) {
  const availableIcons = useMemo<MUIconType[]>(() => [typeIcon, ...availableItemIcons], [typeIcon]);

  const selectedHandler = useCallback(
    (icon: MUIconType): void => {
      menuState.close();
      onSelected?.(icon);
    },
    [onSelected, menuState]
  );

  return (
    <MenuPopover {...bindMenu(menuState)}>
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
    </MenuPopover>
  );
}
