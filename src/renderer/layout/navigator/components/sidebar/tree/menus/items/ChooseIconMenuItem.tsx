import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Box, Collapse, Divider, ToggleButton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { Item } from 'infra/configuration/model/configuration';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { useUi } from 'renderer/contexts/UiContext';
import { IconViewer, MUIconType } from 'renderer/components/icon/IconViewer';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useItemIcon from 'renderer/hooks/useItemIcon';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import UseItemIcon from 'renderer/hooks/useItemIcon';

type ChooseIconMenuItemProps = {
  item: Item;
  onClose?: () => void;
};

export default function ChooseIconMenuItem({ item, onClose }: ChooseIconMenuItemProps) {
  const { isRtl } = useUi();

  const [open, setOpen] = useState<boolean>(false);

  const openIcon = useMemo<MUIconType>(() => {
    if (open) {
      return 'KeyboardArrowDownOutlined';
    }
    return isRtl ? 'KeyboardArrowLeftOutlined' : 'KeyboardArrowRightOutlined';
  }, [isRtl, open]);
  const itemIcon = UseItemIcon(item);
  const typeIcon = useMemo<MUIconType>(() => getItemTypeIcon(item.type), [item]);

  const toggleHandler = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const selectedIcon = useItemIcon(item);

  const availableIcons = useMemo<MUIconType[]>(
    () => [
      typeIcon,
      'ChevronRight',
      'LogoutOutlined',
      'AccessAlarmOutlined',
      'AddToPhotosOutlined',
      'AdbOutlined',
      'AccessibleOutlined',
      'AirlineSeatFlatAngledOutlined',
      'AlarmOffOutlined',
      'DownhillSkiingOutlined',
      'StairsOutlined',
      'ElevatorOutlined',
      'ComputerOutlined',
      'KeyboardOutlined',
      'StorageOutlined',
      'ImportantDevicesOutlined',
      'DvrOutlined',
      'MouseOutlined',
      'SettingsInputAntennaOutlined',
      'DeveloperBoardOutlined',
      'PetsOutlined',
      'EmojiNatureOutlined',
      'BugReportOutlined',
    ],
    [typeIcon]
  );

  const updateItemState = useUpdateItem();

  const updateItem = useCallback(
    async (icon: MUIconType): Promise<Item | undefined> => {
      try {
        const itemIcon = icon === typeIcon ? undefined : icon;
        if (itemIcon === item.icon) {
          return undefined;
        }
        return await updateItemState.mutateAsync({ item: { ...item, icon: itemIcon } });
      } catch (e) {}
      return undefined;
    },
    [item, typeIcon, updateItemState]
  );

  return (
    <>
      <CustomMenuItem
        icon={itemIcon}
        text={<FormattedMessage id={'changeIcon'} />}
        onClick={toggleHandler}
        info={<IconViewer icon={openIcon} fontSize={'small'} sx={{ color: 'text.secondary' }} />}
      />
      <Collapse in={open} sx={{ width: 278 }}>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ height: 138, overflow: 'hidden' }}>
          <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
            <Box sx={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.95, px: 1.4, py: 1 }}>
              {availableIcons.map((icon) => {
                const selected = icon === selectedIcon;
                return (
                  <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', minWidth: 0 }} key={icon}>
                    <ToggleButton selected={selected} size={'small'} value={icon} onClick={() => updateItem(icon)}>
                      <IconViewer icon={icon} fontSize={'small'} />
                    </ToggleButton>
                  </Box>
                );
              })}
            </Box>
          </PerfectScrollbar>
        </Box>
        <Divider sx={{ mb: 1 }} />
      </Collapse>
    </>
  );
}
