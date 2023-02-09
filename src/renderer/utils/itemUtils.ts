import { DataCollectionMode, InstanceHealth, ItemType } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { green, pink, red, yellow } from '@mui/material/colors';
import { ColorSchema } from 'renderer/theme/config/palette';
import blueGrey from '@mui/material/colors/blueGrey';
import { MUIconType } from 'renderer/components/common/IconViewer';
import { ItemRO } from '../definitions/daemon';
import { ApplicationRO, FolderRO, InstanceAbility, InstanceRO } from '../../common/generated_definitions';
import { CrudEntity } from '../apis/crud/entity/entity';
import { applicationCrudEntity } from '../apis/crud/entity/entities/application.crud-entity';
import { instanceCrudEntity } from '../apis/crud/entity/entities/instance.crud-entity';
import { folderCrudEntity } from '../apis/crud/entity/entities/folder.crud-entity';

export function isApplication(item: ItemRO): item is ApplicationRO {
  return 'instanceCount' in item;
}

export function isFolder(item: ItemRO): item is FolderRO {
  return !isApplication(item) && !isInstance(item);
}

export function isInstance(item: ItemRO): item is InstanceRO {
  return 'actuatorUrl' in item;
}

export const getItemType = (item: ItemRO): ItemType => {
  if (isApplication(item)) {
    return 'application';
  }
  if (isFolder(item)) {
    return 'folder';
  }
  if (isInstance(item)) {
    return 'instance';
  }
  throw new Error(`Unknown item type`);
};

export const getItemEntity = (item: ItemRO): CrudEntity => {
  return getItemTypeEntity(getItemType(item));
};

export const getItemTypeEntity = (itemType: ItemType): CrudEntity => {
  switch (itemType) {
    case 'folder':
      return folderCrudEntity;
    case 'application':
      return applicationCrudEntity;
    case 'instance':
      return instanceCrudEntity;
    default:
      throw new Error(`Unknown item type`);
  }
};

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

export const getItemUrl = (item: ItemRO): string => {
  if (isApplication(item)) {
    return generatePath(urls.application.url, { id: item.id });
  }
  if (isFolder(item)) {
    return generatePath(urls.folder.url, { id: item.id });
  }
  if (isInstance(item)) {
    return generatePath(urls.instance.url, { id: item.id });
  }
  throw new Error(`Unknown item type`);
};

export const getItemNameTooltip = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
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

export const getApplicationHealthStatusColor = (application: ApplicationRO): string | undefined => {
  if (application.instanceCount === 0) {
    return undefined;
  }
  return undefined;
  // TODO: reimplement
  // switch (application.health.status) {
  //   case 'ALL_UP':
  //     return green[HEALTH_STATUS_COLORS_INDEX];
  //   case 'ALL_DOWN':
  //     return red[HEALTH_STATUS_COLORS_INDEX];
  //   case 'SOME_DOWN':
  //     return orange[HEALTH_STATUS_COLORS_INDEX];
  //   case 'UNKNOWN':
  //     return blueGrey[HEALTH_STATUS_COLORS_INDEX];
  //   case 'PENDING':
  //     return 'text.secondary';
  //   default:
  //     return undefined;
  // }
};

export const getItemHealthStatusColor = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
    // TODO: reimplement
    // return getInstanceHealthStatusColor(item.health);
  }
  if (isApplication(item)) {
    return getApplicationHealthStatusColor(item);
  }
  return undefined;
};

export const getItemHealthStatusTextId = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
    return undefined;
    // TODO: reimplement
    // switch (item.health.status) {
    //   case 'UP':
    //     return 'up';
    //   case 'DOWN':
    //     return 'down';
    //   case 'OUT_OF_SERVICE':
    //     return 'outOfService';
    //   case 'UNREACHABLE':
    //     return 'unreachable';
    //   case 'UNKNOWN':
    //     return 'unknown';
    //   case 'PENDING':
    //     return 'loading';
    //   default:
    //     return undefined;
    // }
  }
  if (isApplication(item)) {
    if (item.instanceCount === 0) {
      return undefined;
    }
    return undefined;
    // TODO: reimplement
    // switch (item.health.status) {
    //   case 'ALL_UP':
    //     return 'up';
    //   case 'ALL_DOWN':
    //     return 'down';
    //   case 'SOME_DOWN':
    //     return 'mixed';
    //   case 'UNKNOWN':
    //     return 'unknown';
    //   case 'PENDING':
    //     return 'loading';
    //   default:
    //     return undefined;
    // }
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

export const isServiceInactive = (item: InstanceRO, ability: InstanceAbility): boolean => {
  return item.abilities.indexOf(ability) === -1;
};
