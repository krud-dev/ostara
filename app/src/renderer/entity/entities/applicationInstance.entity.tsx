import { Entity } from 'renderer/entity/entity';
import TableCellDataHealthStatus from 'renderer/components/table/data/custom/TableCellDataHealthStatus';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { InstanceAbility, InstanceRO } from '../../../common/generated_definitions';
import { getItemDisplayName } from '../../utils/itemUtils';
import { SHUTDOWN_ID } from '../actions';
import { FormattedMessage } from 'react-intl';

export type EnrichedInstanceRO = InstanceRO & {
  applicationAbilities?: InstanceAbility[];
};

export const applicationInstanceEntity: Entity<EnrichedInstanceRO> = {
  id: 'applicationInstance',
  columns: [
    {
      id: 'alias',
      type: 'CustomText',
      labelId: 'name',
      getText: (item) => getItemDisplayName(item),
      getTooltip: (item) => item.actuatorUrl,
    },
    {
      id: 'health.status',
      type: 'Custom',
      labelId: 'healthStatus',
      getTooltip: (item) => item.health?.statusText,
      Component: TableCellDataHealthStatus,
    },
    {
      id: 'health.lastUpdateTime',
      type: 'Date',
      labelId: 'lastUpdateTime',
    },
    {
      id: 'health.lastStatusChangeTime',
      type: 'Date',
      labelId: 'lastChangeTime',
    },
  ],
  actions: [
    {
      id: SHUTDOWN_ID,
      labelId: 'shutdown',
      icon: 'PowerSettingsNewOutlined',
      isDisabled: (item) => {
        if (item.health.status !== 'UP' || !item.applicationAbilities?.includes('SHUTDOWN')) {
          return <FormattedMessage id="shutdownInstanceDisabled" />;
        }
        return false;
      },
    },
  ],
  massActions: [],
  globalActions: [],
  rowAction: {
    type: 'Navigate',
    getUrl: (item) => generatePath(urls.instance.url, { id: item.id }),
  },
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) => data.filter((item) => item.alias?.toLowerCase().includes(filter.toLowerCase())),
};
