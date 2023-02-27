import { Entity } from 'renderer/entity/entity';
import { COPY_ID } from 'renderer/entity/actions';
import { SystemProperty } from '../../apis/requests/instance/env/getInstanceSystemProperties';
import { SystemEnvironmentProperty } from '../../apis/requests/instance/env/getInstanceSystemEnvironment';

export const instanceSystemEnvironmentEntity: Entity<SystemEnvironmentProperty> = {
  id: 'instanceSystemEnvironment',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'value',
      type: 'Text',
      labelId: 'value',
    },
  ],
  actions: [
    {
      id: COPY_ID,
      labelId: 'copy',
      icon: 'ContentCopyOutlined',
    },
  ],
  massActions: [
    {
      id: COPY_ID,
      labelId: 'copy',
      icon: 'ContentCopyOutlined',
    },
  ],
  globalActions: [],
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => `${item.name}-${item.value}`,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.value?.toLowerCase().includes(filter.toLowerCase())
    ),
};
