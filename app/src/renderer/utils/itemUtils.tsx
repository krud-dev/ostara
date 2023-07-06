import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { green, grey, orange, pink, purple, red, yellow } from '@mui/material/colors';
import blueGrey from '@mui/material/colors/blueGrey';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import { ItemRO, ItemType } from 'renderer/definitions/daemon';
import {
  AgentHealthDTO$Companion$Status,
  AgentRO,
  ApplicationHealthStatus,
  ApplicationRO,
  FolderRO,
  InstanceHealthStatus,
  InstanceRO,
} from 'common/generated_definitions';
import { CrudEntity } from 'renderer/apis/requests/crud/entity/entity';
import { applicationCrudEntity } from 'renderer/apis/requests/crud/entity/entities/application.crudEntity';
import { instanceCrudEntity } from 'renderer/apis/requests/crud/entity/entities/instance.crudEntity';
import { folderCrudEntity } from 'renderer/apis/requests/crud/entity/entities/folder.crudEntity';
import React, { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import FormattedRelativeTimeNow from 'renderer/components/format/FormattedRelativeTimeNow';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';

export function isApplication(item: ItemRO): item is ApplicationRO {
  return 'type' in item;
}

export function isFolder(item: ItemRO): item is FolderRO {
  return !isApplication(item) && !isInstance(item) && !isAgent(item);
}

export function isInstance(item: ItemRO): item is InstanceRO {
  return 'actuatorUrl' in item;
}

export function isAgent(item: ItemRO): item is AgentRO {
  return 'url' in item;
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
  if (isAgent(item)) {
    return 'agent';
  }
  throw new Error(`Unknown item type`);
};

export const getItemDisplayName = (item: ItemRO): string => {
  if (isApplication(item)) {
    return item.alias;
  }
  if (isFolder(item)) {
    return item.alias;
  }
  if (isInstance(item)) {
    return (
      item.alias ||
      item.hostname ||
      item.actuatorUrl
        .replace(/^https?:\/\//i, '') // Remove protocol
        .replace(/\/.*$/, '') // Remove path
    );
  }
  if (isAgent(item)) {
    return item.name;
  }
  throw new Error(`Unknown item type`);
};

export const getItemParentId = (item: ItemRO): string | undefined => {
  if (isApplication(item)) {
    return item.parentAgentId || item.parentFolderId;
  }
  if (isFolder(item)) {
    return item.parentFolderId;
  }
  if (isInstance(item)) {
    return item.parentApplicationId;
  }
  if (isAgent(item)) {
    return item.parentFolderId;
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
    case 'agent':
      return agentCrudEntity;
    default:
      throw new Error(`Unknown item type`);
  }
};

export const getItemNameKey = (item: ItemRO): string => {
  return getItemTypeNameKey(getItemType(item));
};

export const getItemTypeNameKey = (itemType: ItemType): string => {
  switch (itemType) {
    case 'folder':
    case 'application':
    case 'instance':
      return 'alias';
    case 'agent':
      return 'name';
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
    case 'agent':
      return 'SensorsOutlined';
    default:
      throw new Error(`Unknown item type`);
  }
};

export const getItemTypeTextId = (itemType: ItemType): string => {
  switch (itemType) {
    case 'folder':
      return 'folder';
    case 'application':
      return 'application';
    case 'instance':
      return 'instance';
    case 'agent':
      return 'agent';
    default:
      throw new Error(`Unknown item type`);
  }
};

export const getItemUrl = (item: ItemRO): string => {
  const itemType = getItemType(item);
  switch (itemType) {
    case 'folder':
      return generatePath(urls.folder.url, { id: item.id });
    case 'application':
      return generatePath(urls.application.url, { id: item.id });
    case 'instance':
      return generatePath(urls.instance.url, { id: item.id });
    case 'agent':
      return generatePath(urls.agent.url, { id: item.id });
    default:
      throw new Error(`Unknown item type`);
  }
};

export const getItemNameTooltip = (item: ItemRO): ReactNode | undefined => {
  if (isInstance(item)) {
    return item.actuatorUrl;
  }
  if (isAgent(item)) {
    return item.url;
  }
  return undefined;
};

export const getItemVersion = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
    if (item.metadata?.version) {
      return item.metadata.version;
    }
    if (item.metadata.gitBranch && item.metadata.gitCommitId) {
      return `${item.metadata.gitBranch} (${item.metadata.gitCommitId})`;
    }
    return undefined;
  }
  return undefined;
};

export const getItemVersionTooltip = (item: ItemRO): ReactNode | undefined => {
  if (isInstance(item)) {
    return (
      <>
        {item.metadata.version && (
          <Box>
            <Box component={'span'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={'version'} />:
            </Box>{' '}
            {item.metadata.version}
          </Box>
        )}
        {item.metadata.buildTime && (
          <Box>
            <Box component={'span'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={'buildTime'} />:
            </Box>{' '}
            <FormattedRelativeTimeNow value={item.metadata.buildTime} />
          </Box>
        )}
        {item.metadata.gitBranch && (
          <Box>
            <Box component={'span'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={'gitBranch'} />:
            </Box>{' '}
            {item.metadata.gitBranch}
          </Box>
        )}
        {item.metadata.gitCommitId && (
          <Box>
            <Box component={'span'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={'gitCommit'} />:
            </Box>{' '}
            {item.metadata.gitCommitId}
          </Box>
        )}
      </>
    );
  }
  return undefined;
};

export const isItemDemo = (item: ItemRO): boolean => {
  if (isApplication(item)) {
    return item.demo;
  }
  if (isInstance(item)) {
    return item.demo;
  }
  return false;
};

export const isItemUpdatable = (item: ItemRO): boolean => {
  if (isItemDemo(item)) {
    return false;
  }
  if (isInstance(item) && item.discovered) {
    return false;
  }
  return true;
};

export const isItemDeletable = (item: ItemRO): boolean => {
  if (isItemDemo(item)) {
    return false;
  }
  return true;
};

export const isItemInactive = (item: ItemRO): boolean => {
  if (isInstance(item)) {
    return item.health.status === 'UNREACHABLE' || item.health.status === 'INVALID';
  }
  if (isAgent(item)) {
    return item.health.status === 'UNHEALTHY';
  }
  return false;
};

export const isItemHealthy = (item: ItemRO): boolean => {
  if (isApplication(item)) {
    return item.health.status === 'ALL_UP';
  }
  if (isInstance(item)) {
    return item.health.status === 'UP';
  }
  if (isAgent(item)) {
    return item.health.status === 'HEALTHY';
  }
  return true;
};

const HEALTH_STATUS_COLORS_INDEX = 600;

export const getInstanceHealthStatusColor = (status: InstanceHealthStatus): string | undefined => {
  switch (status) {
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
    case 'INVALID':
      return purple[HEALTH_STATUS_COLORS_INDEX];
    case 'PENDING':
      return 'text.primary';
    default:
      return undefined;
  }
};

export const getApplicationHealthStatusColor = (status: ApplicationHealthStatus): string | undefined => {
  switch (status) {
    case 'ALL_UP':
      return green[HEALTH_STATUS_COLORS_INDEX];
    case 'ALL_DOWN':
      return red[HEALTH_STATUS_COLORS_INDEX];
    case 'SOME_DOWN':
      return orange[HEALTH_STATUS_COLORS_INDEX];
    case 'UNKNOWN':
      return blueGrey[HEALTH_STATUS_COLORS_INDEX];
    case 'EMPTY':
      return grey[HEALTH_STATUS_COLORS_INDEX];
    case 'PENDING':
      return 'text.primary';
    default:
      return undefined;
  }
};

export const getAgentHealthStatusColor = (status: AgentHealthDTO$Companion$Status): string | undefined => {
  switch (status) {
    case 'HEALTHY':
      return green[HEALTH_STATUS_COLORS_INDEX];
    case 'UNHEALTHY':
      return yellow[HEALTH_STATUS_COLORS_INDEX];
    case 'PENDING':
      return 'text.primary';
    default:
      return undefined;
  }
};

export const getItemHealthStatusColor = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
    return getInstanceHealthStatusColor(item.health.status);
  }
  if (isApplication(item)) {
    return getApplicationHealthStatusColor(item.health.status);
  }
  if (isAgent(item)) {
    return getAgentHealthStatusColor(item.health.status);
  }
  return undefined;
};

export const getInstanceHealthStatusTextId = (status: InstanceHealthStatus): string | undefined => {
  switch (status) {
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
    case 'INVALID':
      return 'invalid';
    case 'PENDING':
      return 'loading';
    default:
      return undefined;
  }
};

export const getApplicationHealthStatusTextId = (status: ApplicationHealthStatus): string | undefined => {
  switch (status) {
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
    case 'EMPTY':
      return 'empty';
    default:
      return undefined;
  }
};

export const getAgentHealthStatusTextId = (status: AgentHealthDTO$Companion$Status): string | undefined => {
  switch (status) {
    case 'HEALTHY':
      return 'healthy';
    case 'UNHEALTHY':
      return 'unhealthy';
    case 'PENDING':
      return 'loading';
    default:
      return undefined;
  }
};

export const getItemHealthStatusTextId = (item: ItemRO): string | undefined => {
  if (isInstance(item)) {
    return getInstanceHealthStatusTextId(item.health.status);
  }
  if (isApplication(item)) {
    return getApplicationHealthStatusTextId(item.health.status);
  }
  if (isAgent(item)) {
    return getAgentHealthStatusTextId(item.health.status);
  }
  return undefined;
};

export const getInstanceHealthStatusIcon = (status: InstanceHealthStatus): MUIconType => {
  switch (status) {
    case 'UP':
      return 'ArrowCircleUpOutlined';
    case 'DOWN':
      return 'ArrowCircleDownOutlined';
    case 'OUT_OF_SERVICE':
      return 'WarningAmberOutlined';
    case 'UNREACHABLE':
      return 'CrisisAlertOutlined';
    case 'UNKNOWN':
      return 'QuestionMarkOutlined';
    case 'INVALID':
      return 'LinkOffOutlined';
    case 'PENDING':
      return 'HourglassEmptyOutlined';
    default:
      return 'QuestionMarkOutlined';
  }
};

export const getApplicationHealthStatusIcon = (status: ApplicationHealthStatus): MUIconType => {
  switch (status) {
    case 'ALL_UP':
      return 'ArrowCircleUpOutlined';
    case 'ALL_DOWN':
      return 'ArrowCircleDownOutlined';
    case 'SOME_DOWN':
      return 'SwapVerticalCircleOutlined';
    case 'UNKNOWN':
      return 'QuestionMarkOutlined';
    case 'EMPTY':
      return 'MotionPhotosOffOutlined';
    case 'PENDING':
      return 'HourglassEmptyOutlined';
    default:
      return 'QuestionMarkOutlined';
  }
};

export const getAgentHealthStatusIcon = (status: AgentHealthDTO$Companion$Status): MUIconType => {
  switch (status) {
    case 'HEALTHY':
      return 'LinkOutlined';
    case 'UNHEALTHY':
      return 'LinkOffOutlined';
    case 'PENDING':
      return 'HourglassEmptyOutlined';
    default:
      return 'QuestionMarkOutlined';
  }
};

const ITEM_HEALTH_STATUS_LOADING_COMPONENT = <CircularProgress size={6} thickness={12} />;

export const getInstanceHealthStatusComponent = (item: InstanceRO): ReactNode | undefined => {
  if (item.health.status === 'PENDING') {
    return ITEM_HEALTH_STATUS_LOADING_COMPONENT;
  }
  return undefined;
};

export const getApplicationHealthStatusComponent = (item: ApplicationRO): ReactNode | undefined => {
  if (item.health.status === 'PENDING') {
    return ITEM_HEALTH_STATUS_LOADING_COMPONENT;
  }
  return undefined;
};

export const getAgentHealthStatusComponent = (item: AgentRO): ReactNode | undefined => {
  switch (item.health.status) {
    case 'PENDING':
      return ITEM_HEALTH_STATUS_LOADING_COMPONENT;
    case 'HEALTHY':
      return <></>;
    case 'UNHEALTHY':
      return <IconViewer icon={'WarningOutlined'} sx={{ color: 'warning.main', fontSize: 10 }} />;
    default:
      return undefined;
  }
};

export const getItemHealthStatusComponent = (item: ItemRO): ReactNode | undefined => {
  if (isInstance(item)) {
    return getInstanceHealthStatusComponent(item);
  }
  if (isApplication(item)) {
    return getApplicationHealthStatusComponent(item);
  }
  if (isAgent(item)) {
    return getAgentHealthStatusComponent(item);
  }
  return undefined;
};

// export const getDataCollectionModeColor = (dataCollectionMode: DataCollectionMode): ColorSchema => {
//   switch (dataCollectionMode) {
//     case 'on':
//       return 'success';
//     case 'off':
//       return 'error';
//     default:
//       return 'primary';
//   }
// };
//
// export const getDataCollectionModeTextId = (dataCollectionMode: DataCollectionMode): string => {
//   switch (dataCollectionMode) {
//     case 'on':
//       return 'on';
//     case 'off':
//       return 'off';
//     default:
//       return 'notAvailable';
//   }
// };

export const getActuatorUrls = (value: string): string[] => {
  return value
    .split(/[,\n ]/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
};
