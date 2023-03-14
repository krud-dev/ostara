import { Entity } from 'renderer/entity/entity';
import { InstanceBean } from 'renderer/apis/requests/instance/beans/getInstanceBeans';
import InstanceBeanDetails from 'renderer/pages/navigator/instance/beans/components/InstanceBeanDetails';
import { GRAPH_ID } from '../actions';

export const instanceBeanEntity: Entity<InstanceBean> = {
  id: 'instanceBean',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
      width: 300,
    },
    {
      id: 'package',
      type: 'Text',
      labelId: 'package',
      width: 300,
    },
    {
      id: 'scope',
      type: 'Label',
      labelId: 'scope',
      width: 125,
      getColor: () => 'default',
    },
  ],
  actions: [
    {
      id: GRAPH_ID,
      icon: 'MediationOutlined',
      labelId: 'showGraph',
    },
  ],
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
  paging: true,
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
