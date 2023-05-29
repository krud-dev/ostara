import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { useGetItemAbilitiesQuery } from '../../../../../../../apis/requests/item/getItemAbilities';
import Divider from '@mui/material/Divider';
import useItemShutdown from '../../../../../../../hooks/useItemShutdown';

type DeleteMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function ShutdownMenuItem({ item, onClose }: DeleteMenuItemProps) {
  const abilitiesState = useGetItemAbilitiesQuery({ item: item });

  const disabled = useMemo<boolean>(
    () => !abilitiesState.data || !abilitiesState.data.includes('SHUTDOWN'),
    [abilitiesState.data]
  );

  const { itemShutdown } = useItemShutdown();

  const showdownHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await itemShutdown(item);
  }, [item, itemShutdown]);

  return (
    <>
      <Divider />

      <CustomMenuItem
        icon={'PowerSettingsNewOutlined'}
        text={<FormattedMessage id={'shutdown'} />}
        onClick={showdownHandler}
        color={'error.main'}
        disabled={disabled}
      />
    </>
  );
}
