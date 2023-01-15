import { Entity } from 'renderer/entity/entity';
import { InstanceBean } from 'renderer/apis/instance/getInstanceBeans';
import InstanceBeanDetails from 'renderer/pages/navigator/instance/beans/components/InstanceBeanDetails';
import { COPY_ID } from 'renderer/entity/actions';

export const instanceBeanEntity: Entity<InstanceBean> = {
  id: 'instanceBean',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'scope',
      type: 'Chip',
      labelId: 'scope',
      getColor: () => 'default',
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
  rowAction: {
    type: 'Details',
    Component: InstanceBeanDetails,
  },
  defaultOrder: {
    id: 'name',
    direction: 'asc',
  },
  paging: false,
  getId: (item) => `${item.type}.${item.name}`,
  getAnchor: (item) => item.name,
  getGrouping: (item) => {
    const index = item.type.lastIndexOf('.');
    return index > 0 ? item.type.substring(0, index) : item.type;
  },
  groupingTreeSeparator: '.',
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.type?.toLowerCase().includes(filter.toLowerCase())
    ),
};
