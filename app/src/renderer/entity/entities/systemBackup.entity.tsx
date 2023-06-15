import { Entity } from 'renderer/entity/entity';
import { BACKUP_ID, DELETE_ID, RESTORE_ID } from '../actions';
import { SystemBackupRO } from 'common/generated_definitions';

export const systemBackupEntity: Entity<SystemBackupRO> = {
  id: 'systemBackup',
  columns: [
    {
      id: 'fileName',
      type: 'Text',
      labelId: 'fileName',
    },
    {
      id: 'date',
      type: 'Date',
      labelId: 'time',
    },
    {
      id: 'auto',
      type: 'Boolean',
      labelId: 'auto',
      width: 100,
    },
    {
      id: 'valid',
      type: 'Boolean',
      labelId: 'valid',
      width: 100,
      getTooltip: (item) => (item.valid ? undefined : item.error),
    },
  ],
  actions: [
    {
      id: RESTORE_ID,
      labelId: 'restore',
      icon: 'RestoreOutlined',
      isDisabled: (item) => !item.valid,
    },
    {
      id: DELETE_ID,
      labelId: 'delete',
      icon: 'DeleteOutlined',
    },
  ],
  massActions: [],
  globalActions: [
    {
      id: BACKUP_ID,
      labelId: 'backupNow',
      icon: 'MoreTimeOutlined',
    },
  ],
  defaultOrder: [
    {
      id: 'date',
      direction: 'desc',
    },
  ],
  paging: true,
  getId: (item) => item.fileName,
  filterData: (data, filter) => data.filter((item) => item.fileName?.toLowerCase().includes(filter.toLowerCase())),
};
