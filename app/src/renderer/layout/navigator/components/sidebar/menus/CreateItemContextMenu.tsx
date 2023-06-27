import CreateItemMenuItems from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenuItems';
import ContextMenuPopper, { ContextMenuPopperProps } from 'renderer/components/menu/popup/ContextMenuPopper';
import React, { useMemo } from 'react';
import { ContextMenuContext } from 'renderer/components/menu/popup/ContextMenuContext';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

type CreateItemContextMenuProps = ContextMenuPopperProps;

export default function CreateItemContextMenu({ disabled, ...props }: CreateItemContextMenuProps) {
  const { data } = useNavigatorLayoutContext();

  const disabledInternal = useMemo<boolean>(() => !data || disabled, [data, disabled]);

  return (
    <ContextMenuPopper disabled={disabledInternal} {...props}>
      <ContextMenuContext.Consumer>
        {({ menuState }) => <CreateItemMenuItems menuState={menuState} />}
      </ContextMenuContext.Consumer>
    </ContextMenuPopper>
  );
}
