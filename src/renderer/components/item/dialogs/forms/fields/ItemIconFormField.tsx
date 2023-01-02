import React, { useCallback, useMemo } from 'react';
import { ItemType } from 'infra/configuration/model/configuration';
import { IconButton } from '@mui/material';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import { IconViewer, MUIconType } from 'renderer/components/icon/IconViewer';
import { useFormContext } from 'react-hook-form';
import ItemIconContextMenu from 'renderer/components/item/dialogs/forms/fields/ItemIconContextMenu';

type ItemIconFormFieldProps = { type: ItemType };

export default function ItemIconFormField({ type }: ItemIconFormFieldProps) {
  const menuState = usePopupState({ variant: 'popper' });

  const { watch, setValue } = useFormContext<{ icon?: string }>();

  const formIcon = watch('icon');
  const typeIcon = useMemo<MUIconType>(() => getItemTypeIcon(type), [type]);
  const icon = useMemo<MUIconType>(() => (formIcon as MUIconType) || typeIcon, [formIcon, typeIcon]);

  const openMenuHandler = useCallback(
    (event: React.MouseEvent): void => {
      menuState.open();
    },
    [menuState]
  );

  const iconSelectedHandler = useCallback(
    (selectedIcon: MUIconType): void => {
      setValue('icon', selectedIcon === typeIcon ? undefined : selectedIcon);
    },
    [typeIcon]
  );

  return (
    <>
      <IconButton size={'small'} onClick={openMenuHandler} ref={menuState.setAnchorEl}>
        <IconViewer icon={icon} fontSize={'small'} />
      </IconButton>

      <ItemIconContextMenu
        typeIcon={typeIcon}
        selectedIcon={icon}
        onSelected={iconSelectedHandler}
        {...bindMenu(menuState)}
      />
    </>
  );
}
