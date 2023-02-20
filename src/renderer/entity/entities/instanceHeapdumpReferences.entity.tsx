import { Entity } from 'renderer/entity/entity';
import { InstanceHeapdumpReferenceRO } from '../../../common/generated_definitions';
import { DELETE_ID, DOWNLOAD_ID, REQUEST_ID } from '../actions';
import { FormattedMessage } from 'react-intl';

export const instanceHeapdumpReferencesEntity: Entity<InstanceHeapdumpReferenceRO> = {
  id: 'instanceHeapdumpReference',
  columns: [
    {
      id: 'creationTime',
      type: 'Date',
      labelId: 'requestTime',
    },
    {
      id: 'status',
      type: 'Label',
      labelId: 'status',
      getTooltip: (item) => (item.status === 'FAILED' ? item.error : undefined),
      getColor: (item) => {
        switch (item.status) {
          case 'PENDING_DOWNLOAD':
            return 'default';
          case 'DOWNLOADING':
            return 'info';
          case 'READY':
            return 'success';
          case 'FAILED':
            return 'error';
          default:
            return 'default';
        }
      },
      getText: (item) => {
        switch (item.status) {
          case 'PENDING_DOWNLOAD':
            return <FormattedMessage id={'pending'} />;
          case 'DOWNLOADING':
            return <FormattedMessage id={'downloading'} />;
          case 'READY':
            return <FormattedMessage id={'ready'} />;
          case 'FAILED':
            return <FormattedMessage id={'failed'} />;
          default:
            return <FormattedMessage id={'unknown'} />;
        }
      },
    },
    {
      id: 'size',
      type: 'Bytes',
      labelId: 'size',
    },
  ],
  actions: [
    {
      id: DOWNLOAD_ID,
      labelId: 'download',
      icon: 'DownloadOutlined',
      isDisabled: (item) => item.status !== 'READY',
    },
    {
      id: DELETE_ID,
      labelId: 'delete',
      icon: 'DeleteOutlined',
      isDisabled: (item) => item.status !== 'READY' && item.status !== 'FAILED',
    },
  ],
  massActions: [],
  globalActions: [
    {
      id: REQUEST_ID,
      labelId: 'requestHeapdump',
      icon: 'BrowserUpdatedOutlined',
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
  filterData: (data, filter) => data.filter((item) => item.id?.toLowerCase().includes(filter.toLowerCase())),
};
