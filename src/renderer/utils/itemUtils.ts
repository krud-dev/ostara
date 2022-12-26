import { CloudOutlined, DnsOutlined, FolderOutlined, SvgIconComponent } from '@mui/icons-material';
import { Application, EnrichedItem, Folder, Instance, Item, ItemType } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import NiceModal from '@ebay/nice-modal-react';
import UpdateApplicationDialog from 'renderer/components/item/dialogs/update/UpdateApplicationDialog';
import UpdateInstanceDialog from 'renderer/components/item/dialogs/update/UpdateInstanceDialog';
import UpdateFolderDialog from 'renderer/components/item/dialogs/update/UpdateFolderDialog';
import { green, pink, red, yellow } from '@mui/material/colors';

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

export const getItemHealthStatusColor = (item: EnrichedItem): string | undefined => {
  const colorsIndex = 600;
  if (item.type === 'instance') {
    switch (item.health.status) {
      case 'UP':
        return green[colorsIndex];
      case 'DOWN':
        return red[colorsIndex];
      case 'OUT_OF_SERVICE':
        return yellow[colorsIndex];
      case 'UNREACHABLE':
        return pink[colorsIndex];
      case 'UNKNOWN':
      case 'PENDING':
      default:
        return undefined;
    }
  }
  return undefined;
};

export const getItemHealthStatusTextId = (item: EnrichedItem): string | undefined => {
  if (item.type === 'instance') {
    switch (item.health.status) {
      case 'UP':
        return 'up';
      case 'DOWN':
        return 'down';
      case 'OUT_OF_SERVICE':
        return 'outOfService';
      case 'UNREACHABLE':
        return 'unreachable';
      case 'UNKNOWN':
      case 'PENDING':
      default:
        return undefined;
    }
  }
  return undefined;
};
