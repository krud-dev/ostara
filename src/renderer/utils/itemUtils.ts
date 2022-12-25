import { CloudOutlined, DnsOutlined, FolderOutlined, SvgIconComponent } from '@mui/icons-material';
import { Application, Folder, Instance, Item, ItemType } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import NiceModal from '@ebay/nice-modal-react';
import UpdateApplicationDialog from 'renderer/components/item/dialogs/update/UpdateApplicationDialog';
import UpdateInstanceDialog from 'renderer/components/item/dialogs/update/UpdateInstanceDialog';
import UpdateFolderDialog from 'renderer/components/item/dialogs/update/UpdateFolderDialog';

export const getItemTypeIcon = (itemType: ItemType): SvgIconComponent => {
  switch (itemType) {
    case 'folder':
      return FolderOutlined;
    case 'application':
      return CloudOutlined;
    case 'instance':
      return DnsOutlined;
    default:
      throw new Error(`Unknown item type`);
  }
};

export const getItemUrl = (item: Item): string => {
  switch (item.type) {
    case 'folder':
      return generatePath(urls.folder.url, { id: item.id });
    case 'application':
      return generatePath(urls.application.url, { id: item.id });
    case 'instance':
      return generatePath(urls.instance.url, { id: item.id });
    default:
      throw new Error(`Unknown item type`);
  }
};

export const updateItem = async (item: Item): Promise<Item | undefined> => {
  switch (item.type) {
    case 'folder':
      return await NiceModal.show<Folder | undefined>(UpdateFolderDialog, {
        item: item,
      });
    case 'application':
      return await NiceModal.show<Application | undefined>(UpdateApplicationDialog, {
        item: item,
      });
    case 'instance':
      return await NiceModal.show<Instance | undefined>(UpdateInstanceDialog, {
        item: item,
      });
    default:
      throw new Error(`Unknown item type`);
  }
};
