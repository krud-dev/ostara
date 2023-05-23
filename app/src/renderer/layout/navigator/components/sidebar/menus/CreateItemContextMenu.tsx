import CreateItemMenuItems from 'renderer/layout/navigator/components/sidebar/menus/CreateItemMenuItems';
import ContextMenuPopper, { ContextMenuPopperProps } from 'renderer/components/menu/popup/ContextMenuPopper';
import React, { useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { ContextMenuContext } from 'renderer/components/menu/popup/ContextMenuContext';

type CreateItemContextMenuProps = ContextMenuPopperProps;

export default function CreateItemContextMenu({ disabled, ...props }: CreateItemContextMenuProps) {
  const { data } = useNavigatorTree();

  const disabledInternal = useMemo<boolean>(() => !data || disabled, [data, disabled]);

  return (
    <ContextMenuPopper disabled={disabledInternal} {...props}>
      <ContextMenuContext.Consumer>
        {({ menuState }) => <CreateItemMenuItems menuState={menuState} />}
      </ContextMenuContext.Consumer>
    </ContextMenuPopper>
  );
}
