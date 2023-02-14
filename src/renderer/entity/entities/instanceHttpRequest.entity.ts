import { Entity } from 'renderer/entity/entity';
import InstanceHttpRequestDetails from 'renderer/pages/navigator/instance/http-requests/components/InstanceHttpRequestDetails';
import { InstanceHttpRequestStatisticsRO } from '../../../common/generated_definitions';

export const HTTPS_REQUESTS_TIME_ROUND = 5;

export const instanceHttpRequestEntity: Entity<InstanceHttpRequestStatisticsRO> = {
  id: 'instanceHttpRequest',
  columns: [
    {
      id: 'uri',
      type: 'Text',
      labelId: 'uri',
      width: '100%',
    },
    {
      id: 'count',
      type: 'Number',
      labelId: 'count',
    },
    {
      id: 'max',
      type: 'Number',
      labelId: 'maxTime',
      round: HTTPS_REQUESTS_TIME_ROUND,
    },
    {
      id: 'totalTime',
      type: 'Number',
      labelId: 'totalTime',
      round: HTTPS_REQUESTS_TIME_ROUND,
    },
  ],
  actions: [],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Details',
    Component: InstanceHttpRequestDetails,
  },
  defaultOrder: [
    {
      id: 'uri',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.uri,
  filterData: (data, filter) => data.filter((item) => item.uri?.toLowerCase().includes(filter.toLowerCase())),
};
