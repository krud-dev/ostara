import { ReactNode, useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { useGetItemAbilitiesQuery } from '../../../../../../../apis/requests/item/getItemAbilities';
import Divider from '@mui/material/Divider';
import useItemShutdown from 'renderer/hooks/items/useItemShutdown';
import { isItemHealthy } from '../../../../../../../utils/itemUtils';
import { Box, Tooltip } from '@mui/material';
import MenuDivider from '../../../../../../../components/menu/item/MenuDivider';

type ShutdownMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function ShutdownMenuItem({ item, onClose }: ShutdownMenuItemProps) {
  const abilitiesState = useGetItemAbilitiesQuery({ item: item });

  const disabled = useMemo<boolean>(
    () => !isItemHealthy(item) || !abilitiesState.data?.includes('SHUTDOWN'),
    [abilitiesState.data]
  );
  const tooltip = useMemo<ReactNode | undefined>(
    () => (disabled ? <FormattedMessage id={'shutdownInstanceDisabled'} /> : undefined),
    [disabled]
  );

  const { itemShutdown } = useItemShutdown();

  const showdownHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await itemShutdown(item);
  }, [item, itemShutdown]);

  return (
    <>
      <MenuDivider />

      <CustomMenuItem
        icon={'PowerSettingsNewOutlined'}
        text={<FormattedMessage id={'shutdown'} />}
        onClick={showdownHandler}
        color={'error.main'}
        disabled={disabled}
        tooltip={tooltip}
      />
    </>
  );
}
