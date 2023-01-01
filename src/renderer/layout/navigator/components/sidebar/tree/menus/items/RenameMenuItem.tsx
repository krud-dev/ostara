import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { Item } from 'infra/configuration/model/configuration';
import { updateItem } from 'renderer/utils/itemUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';

type RenameMenuItemProps = {
  item: Item;
  node?: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function RenameMenuItem({ item, node, onClose }: RenameMenuItemProps) {
  const renameHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    if (node) {
      await node.edit();
    } else {
      await updateItem(item);
    }
  }, [item, node, onClose]);

  return (
    <CustomMenuItem icon={'TextFieldsOutlined'} text={<FormattedMessage id={'rename'} />} onClick={renameHandler} />
  );
}
