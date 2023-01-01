import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { updateItem } from 'renderer/utils/itemUtils';
import { Item } from 'infra/configuration/model/configuration';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';

type UpdateMenuItemProps = {
  item: Item;
  onClose?: () => void;
};

export default function UpdateMenuItem({ item, onClose }: UpdateMenuItemProps) {
  const updateHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    await updateItem(item);
  }, [item, onClose]);

  return <CustomMenuItem icon={'EditOutlined'} text={<FormattedMessage id={'update'} />} onClick={updateHandler} />;
}
