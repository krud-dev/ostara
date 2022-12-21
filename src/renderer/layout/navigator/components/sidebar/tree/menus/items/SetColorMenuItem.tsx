import { useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { PaletteOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { NodeApi } from 'react-arborist';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { useUpdateItem } from 'renderer/apis/configuration/item/updateItem';
import NiceModal from '@ebay/nice-modal-react';
import ChooseColorDialog from 'renderer/components/dialog/ChooseColorDialog';

type SetColorMenuItemProps = {
  node: NodeApi<TreeItem>;
  onClose?: () => void;
};

export default function SetColorMenuItem({ node, onClose }: SetColorMenuItemProps) {
  const updateItemState = useUpdateItem();

  const setColorHandler = useCallback(async (): Promise<void> => {
    onClose?.();

    const newColor = await NiceModal.show<string | undefined>(ChooseColorDialog, {
      defaultValue: node.data.color,
    });
    if (!newColor) {
      return;
    }
    try {
      await updateItemState.mutateAsync({ item: { ...node.data, color: newColor } });
    } catch (e) {}
  }, [onClose, node.data, updateItemState]);

  return (
    <MenuItem onClick={setColorHandler}>
      <ListItemIcon>
        <PaletteOutlined fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id={'setColor'} />
      </ListItemText>
    </MenuItem>
  );
}
