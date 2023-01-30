import {
  DataCollectionMode,
  EnrichedApplication,
  EnrichedInstance,
  EnrichedItem,
  InstanceHealth,
  Item,
  ItemType,
} from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { green, orange, pink, red, yellow } from '@mui/material/colors';
import { ColorSchema } from 'renderer/theme/config/palette';
import blueGrey from '@mui/material/colors/blueGrey';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { InstanceAbility } from 'infra/instance/models/ability';

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

export const getItemNameTooltip = (item: EnrichedItem): string | undefined => {
  if (item.type === 'instance') {
    return item.actuatorUrl;
  }
  return undefined;
};

const HEALTH_STATUS_COLORS_INDEX = 600;

export const getInstanceHealthStatusColor = (instanceHealth: InstanceHealth): string | undefined => {
  switch (instanceHealth.status) {
    case 'UP':
      return green[HEALTH_STATUS_COLORS_INDEX];
    case 'DOWN':
      return red[HEALTH_STATUS_COLORS_INDEX];
    case 'OUT_OF_SERVICE':
      return yellow[HEALTH_STATUS_COLORS_INDEX];
    case 'UNREACHABLE':
      return pink[HEALTH_STATUS_COLORS_INDEX];
    case 'UNKNOWN':
      return blueGrey[HEALTH_STATUS_COLORS_INDEX];
    case 'PENDING':
      return 'text.secondary';
    default:
      return undefined;
  }
};

export const getApplicationHealthStatusColor = (application: EnrichedApplication): string | undefined => {
  if (application.instanceCount === 0) {
    return undefined;
  }
  switch (application.health.status) {
    case 'ALL_UP':
      return green[HEALTH_STATUS_COLORS_INDEX];
    case 'ALL_DOWN':
      return red[HEALTH_STATUS_COLORS_INDEX];
    case 'SOME_DOWN':
      return orange[HEALTH_STATUS_COLORS_INDEX];
    case 'UNKNOWN':
      return blueGrey[HEALTH_STATUS_COLORS_INDEX];
    case 'PENDING':
      return 'text.secondary';
    default:
      return undefined;
  }
};

export const getItemHealthStatusColor = (item: EnrichedItem): string | undefined => {
  if (item.type === 'instance') {
    return getInstanceHealthStatusColor(item.health);
  }
  if (item.type === 'application') {
    return getApplicationHealthStatusColor(item);
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
    if (item.instanceCount === 0) {
      return undefined;
    }
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

export const isServiceInactive = (item: EnrichedInstance, ability: InstanceAbility): boolean => {
  return item.abilities.indexOf(ability) === -1;
};
