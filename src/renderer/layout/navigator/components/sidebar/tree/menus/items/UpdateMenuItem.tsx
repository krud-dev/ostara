import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import { ItemRO } from '../../../../../../../definitions/daemon';

type UpdateMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function UpdateMenuItem({ item, onClose }: UpdateMenuItemProps) {
  const updateHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await showUpdateItemDialog(item);
  }, [item, onClose]);

  return <CustomMenuItem icon={'EditOutlined'} text={<FormattedMessage id={'update'} />} onClick={updateHandler} />;
}
