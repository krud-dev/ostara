import React, { useCallback, useMemo } from 'react';
import {
  ApplicationRO,
  ApplicationType,
  BackupDTO,
  BackupDTO$TreeElementUnion,
  InstanceRO,
} from 'common/generated_definitions';
import NavigatorTreeBase from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreeBase';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { v4 as uuidv4 } from 'uuid';
import NavigatorTreeNodePreview from 'renderer/layout/navigator/components/sidebar/tree/nodes/NavigatorTreeNodePreview';

type NavigatorTreePreviewProps = {
  backup: BackupDTO;
};

export default function NavigatorTreePreview({ backup }: NavigatorTreePreviewProps) {
  const convertBackupItemToTreeItem = useCallback((backupItem: BackupDTO$TreeElementUnion): TreeItem => {
    const id = uuidv4();
    if (backupItem.type === 'application') {
      const application: ApplicationRO & { children: InstanceRO[] } = {
        id: id,
        ...backupItem.model,
        instanceCount: backupItem.children.length,
        type: backupItem.model.type as ApplicationType,
        demo: false,
        authentication: { type: 'none' },
        discovered: false,
        health: {
          status: 'UNKNOWN',
          lastUpdateTime: 0,
          lastStatusChangeTime: 0,
          applicationId: id,
        },
        children: backupItem.children.map((i) => {
          const instanceId = uuidv4();
          return {
            id: instanceId,
            parentApplicationId: id,
            metadata: {},
            demo: false,
            authentication: { type: 'none' },
            discovered: false,
            health: {
              status: 'UNKNOWN',
              lastUpdateTime: 0,
              lastStatusChangeTime: 0,
              applicationId: id,
              instanceId: instanceId,
            },
            ...i.model,
          };
        }),
      };
      return application;
    }

    return {
      id: id,
      ...backupItem.model,
      authentication: { type: 'none' },
      children: backupItem.children?.map(convertBackupItemToTreeItem),
    };
  }, []);

  const data = useMemo<TreeItem[]>(() => {
    return backup.tree.map(convertBackupItemToTreeItem);
  }, [backup]);

  return (
    <AutoSizer>
      {({ width, height }: Size) => (
        <NavigatorTreeBase
          data={data}
          width={width}
          height={height}
          disableDrag
          disableDrop
          disableEdit
          disableMultiSelection
        >
          {NavigatorTreeNodePreview}
        </NavigatorTreeBase>
      )}
    </AutoSizer>
  );
}
