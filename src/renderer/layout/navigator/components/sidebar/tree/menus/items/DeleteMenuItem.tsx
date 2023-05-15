import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDeleteItem } from 'renderer/apis/requests/item/deleteItem';
import { showDeleteConfirmationDialog } from 'renderer/utils/dialogUtils';
import CustomMenuItem from 'renderer/components/menu/item/CustomMenuItem';
import { ItemRO } from '../../../../../../../definitions/daemon';
import { isItemDeletable } from '../../../../../../../utils/itemUtils';

type DeleteMenuItemProps = {
  item: ItemRO;
  onClose?: () => void;
};

export default function DeleteMenuItem({ item, onClose }: DeleteMenuItemProps) {
  const disabled = useMemo<boolean>(() => !isItemDeletable(item), [item]);

  const deleteState = useDeleteItem();

  const deleteHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const confirm = await showDeleteConfirmationDialog(item);
    if (!confirm) {
      return;
    }

    try {
      await deleteState.mutateAsync({ item: item });
    } catch (e) {}
  }, [onClose, item]);

  return (
    <CustomMenuItem
      icon={'DeleteOutlined'}
      text={<FormattedMessage id={'delete'} />}
      onClick={deleteHandler}
      color={'error.main'}
      disabled={disabled}
    />
  );
}
