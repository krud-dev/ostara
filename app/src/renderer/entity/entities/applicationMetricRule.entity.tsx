import { Entity } from 'renderer/entity/entity';
import { ADD_ID, DELETE_ID, UPDATE_ID, EVICT_CACHE_ID, STATISTICS_ID } from 'renderer/entity/actions';
import { EnrichedApplicationCacheRO } from '../../apis/requests/application/caches/getApplicationCaches';
import { FormattedMessage } from 'react-intl';
import { Link } from '@mui/material';
import { ABILITIES_DOCUMENTATION_URL } from '../../constants/ui';
import { ApplicationMetricRuleRO } from '../../../common/generated_definitions';

export const applicationMetricRuleEntity: Entity<ApplicationMetricRuleRO> = {
  id: 'applicationMetricRule',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
  ],
  actions: [
    {
      id: UPDATE_ID,
      labelId: 'update',
      icon: 'EditOutlined',
    },
    {
      id: DELETE_ID,
      labelId: 'delete',
      icon: 'DeleteOutlined',
    },
  ],
  massActions: [],
  globalActions: [
    {
      id: ADD_ID,
      labelId: 'addMetricNotification',
      icon: 'NotificationAddOutlined',
    },
  ],
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) => data.filter((item) => item.name?.toLowerCase().includes(filter.toLowerCase())),
};
