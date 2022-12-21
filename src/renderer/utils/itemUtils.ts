import { CloudOutlined, DnsOutlined, FolderOutlined, SvgIconComponent } from '@mui/icons-material';
import { ItemType } from 'infra/configuration/model/configuration';

export const getItemTypeIcon = (itemType: ItemType): SvgIconComponent => {
  switch (itemType) {
    case 'application':
      return CloudOutlined;
    case 'folder':
      return FolderOutlined;
    case 'instance':
    default:
      return DnsOutlined;
  }
};
