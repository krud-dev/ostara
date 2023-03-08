import { Entity } from 'renderer/entity/entity';
import { EnrichedInstanceMetric } from '../../apis/requests/instance/metrics/getInstanceMetrics';
import MetricDetails from '../../pages/navigator/instance/metrics/components/MetricDetails';

export const instanceMetricEntity: Entity<EnrichedInstanceMetric> = {
  id: 'instanceSystemEnvironment',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: MetricDetails,
  },
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.name,
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
