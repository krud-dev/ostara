import { DataCollectionMode, EnrichedItem, Item, ItemType } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { green, orange, pink, red, yellow } from '@mui/material/colors';
import { ColorSchema } from 'renderer/theme/config/palette';
import blueGrey from '@mui/material/colors/blueGrey';
import { MUIconType } from 'renderer/components/icon/IconViewer';

export const getItemTypeIcon = (itemType: ItemType): MUIconType => {
  switch (itemType) {
    case 'folder':
      return 'FolderOutlined';
    case 'application':
      return 'CloudOutlined';
    case 'instance':
      return 'DnsOutlined';
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
        return blueGrey[colorsIndex];
      case 'PENDING':
        return 'text.secondary';
      default:
        return undefined;
    }
  }
  if (item.type === 'application') {
    switch (item.health.status) {
      case 'ALL_UP':
        return green[colorsIndex];
      case 'ALL_DOWN':
        return red[colorsIndex];
      case 'SOME_DOWN':
        return orange[colorsIndex];
      case 'UNKNOWN':
        return blueGrey[colorsIndex];
      case 'PENDING':
        return 'text.secondary';
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
        return 'unknown';
      case 'PENDING':
        return 'loading';
      default:
        return undefined;
    }
  }
  if (item.type === 'application') {
    switch (item.health.status) {
      case 'ALL_UP':
        return 'up';
      case 'ALL_DOWN':
        return 'down';
      case 'SOME_DOWN':
        return 'mixed';
      case 'UNKNOWN':
        return 'unknown';
      case 'PENDING':
        return 'loading';
      default:
        return undefined;
    }
  }
  return undefined;
};

export const getDataCollectionModeColor = (dataCollectionMode: DataCollectionMode): ColorSchema => {
  switch (dataCollectionMode) {
    case 'on':
      return 'success';
    case 'off':
      return 'error';
    default:
      return 'primary';
  }
};

export const getDataCollectionModeTextId = (dataCollectionMode: DataCollectionMode): string => {
  switch (dataCollectionMode) {
    case 'on':
      return 'on';
    case 'off':
      return 'off';
    default:
      return 'notAvailable';
  }
};

export const isItemLoading = (item: EnrichedItem): boolean => {
  if (item.type === 'instance' && item.health.status === 'PENDING') {
    return true;
  }
  if (item.type === 'application' && item.health.status === 'PENDING') {
    return true;
  }
  return false;
};
