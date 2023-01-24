import { Entity } from 'renderer/entity/entity';
import { InstanceBean } from 'renderer/apis/instance/getInstanceBeans';
import InstanceBeanDetails from 'renderer/pages/navigator/instance/beans/components/InstanceBeanDetails';

export const instanceBeanEntity: Entity<InstanceBean> = {
  id: 'instanceBean',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'package',
      type: 'Text',
      labelId: 'package',
    },
    {
      id: 'scope',
      type: 'Label',
      labelId: 'scope',
      getColor: () => 'default',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: InstanceBeanDetails,
  },
  defaultOrder: [
    {
      id: 'package',
      direction: 'asc',
    },
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: false,
  getId: (item) => `${item.type}.${item.name}`,
  getAnchor: (item) => item.name,
  // getGrouping: (item) => item.package,
  // groupingTreeSeparator: '.',
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.package?.toLowerCase().includes(filter.toLowerCase()) ||
        item.type?.toLowerCase().includes(filter.toLowerCase())
    ),
};
