import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { isItemDemo } from '../../../../../../../utils/itemUtils';
import useStopDemo from '../../../../../../../hooks/demo/useStopDemo';
import Divider from '@mui/material/Divider';
import MenuDivider from '../../../../../../../components/menu/item/MenuDivider';

type DeleteMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function StopDemoMenuItem({ item, onClose }: DeleteMenuItemProps) {
  const visible = useMemo<boolean>(() => isItemDemo(item), [item]);

  const { stopDemo } = useStopDemo();

  const stopDemoHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    try {
      await stopDemo();
    } catch (e) {}
  }, [onClose, item]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <MenuDivider />

      <CustomMenuItem
        icon={'DangerousOutlined'}
        text={<FormattedMessage id={'stopDemo'} />}
        onClick={stopDemoHandler}
        color={'error.main'}
      />
    </>
  );
}
