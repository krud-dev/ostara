import { CloudOutlined, DnsOutlined, FolderOutlined, SvgIconComponent } from '@mui/icons-material';
import { Item, ItemType } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

export const getItemTypeIcon = (itemType: ItemType): SvgIconComponent => {
  switch (itemType) {
    case 'folder':
      return FolderOutlined;
    case 'application':
      return CloudOutlined;
    case 'instance':
    default:
      return DnsOutlined;
  }
};

export const getItemUrl = (item: Item): string => {
  switch (item.type) {
    case 'folder':
      return generatePath(urls.folder.path, { id: item.id });
    case 'application':
      return generatePath(urls.application.path, { id: item.id });
    case 'instance':
    default:
      return generatePath(urls.instance.path, { id: item.id });
  }
};
