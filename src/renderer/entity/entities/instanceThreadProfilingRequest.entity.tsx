import { Entity } from 'renderer/entity/entity';
import { DELETE_ID, REQUEST_ID, VIEW_ID } from '../actions';
import { FormattedMessage } from 'react-intl';
import { EnrichedThreadProfilingRequestRO } from '../../apis/requests/instance/thread-profiling/getInstanceThreadProfilingRequests';
import { isNil } from 'lodash';

export const instanceThreadProfilingRequestEntity: Entity<EnrichedThreadProfilingRequestRO> = {
  id: 'instanceThreadProfilingRequest',
  columns: [
    {
      id: 'creationTime',
      type: 'Date',
      labelId: 'requestTime',
    },
    {
      id: 'durationSec',
      type: 'CustomText',
      labelId: 'durationSeconds',
      getText: (item, intl) => {
        if (item.status !== 'RUNNING' || isNil(item.secondsRemaining)) {
          return `${item.durationSec}`;
        }
        return `${item.durationSec} (${item.secondsRemaining} ${intl.formatMessage({ id: 'remaining' })})`;
      },
    },
    {
      id: 'status',
      type: 'Label',
      labelId: 'status',
      getColor: (item) => {
        switch (item.status) {
          case 'RUNNING':
            return 'info';
          case 'FINISHED':
            return 'success';
          default:
            return 'default';
        }
      },
      getText: (item) => {
        switch (item.status) {
          case 'RUNNING':
            return <FormattedMessage id={'running'} />;
          case 'FINISHED':
            return <FormattedMessage id={'finished'} />;
          default:
            return <FormattedMessage id={'unknown'} />;
        }
      },
    },
  ],
  actions: [
    {
      id: VIEW_ID,
      labelId: 'viewDetails',
      icon: 'ManageSearchOutlined',
      isDisabled: (item) => item.status !== 'FINISHED',
    },
    {
      id: DELETE_ID,
      labelId: 'delete',
      icon: 'DeleteOutlined',
      isDisabled: (item) => item.status !== 'FINISHED',
    },
  ],
  massActions: [],
  globalActions: [
    {
      id: REQUEST_ID,
      labelId: 'requestThreadProfiling',
      icon: 'SpeedOutlined',
    },
  ],
  defaultOrder: [
    {
      id: 'creationTime',
      direction: 'desc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.status?.toLowerCase().includes(filter.toLowerCase()) ||
        item.durationSec?.toString().toLowerCase().includes(filter.toLowerCase())
    ),
};
