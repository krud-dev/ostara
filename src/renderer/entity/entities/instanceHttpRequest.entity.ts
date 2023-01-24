import { Entity } from 'renderer/entity/entity';
import { InstanceHttpRequestStatistics } from 'infra/instance/models/httpRequestStatistics';
import InstanceHttpRequestDetails from 'renderer/pages/navigator/instance/http-requests/components/InstanceHttpRequestDetails';

export const HTTPS_REQUESTS_TIME_ROUND = 5;

export const instanceHttpRequestEntity: Entity<InstanceHttpRequestStatistics> = {
  id: 'instanceHttpRequest',
  columns: [
    {
      id: 'uri',
      type: 'Text',
      labelId: 'uri',
      width: 300,
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
  paging: false,
  getId: (item) => item.uri,
  filterData: (data, filter) => data.filter((item) => item.uri?.toLowerCase().includes(filter.toLowerCase())),
};
