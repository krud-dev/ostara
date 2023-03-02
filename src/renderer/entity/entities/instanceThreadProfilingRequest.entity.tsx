import { Entity } from 'renderer/entity/entity';
import { ThreadProfilingRequestRO } from '../../../common/generated_definitions';
import { DELETE_ID, REQUEST_ID, VIEW_ID } from '../actions';
import { FormattedMessage } from 'react-intl';

export const instanceThreadProfilingRequestEntity: Entity<ThreadProfilingRequestRO> = {
  id: 'instanceThreadProfilingRequest',
  columns: [
    {
      id: 'creationTime',
      type: 'Date',
      labelId: 'requestTime',
    },
    {
      id: 'durationSec',
      type: 'Number',
      labelId: 'durationSeconds',
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
