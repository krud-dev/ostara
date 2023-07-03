import { Entity } from 'renderer/entity/entity';
import TableCellDataHealthStatus from 'renderer/components/table/data/custom/TableCellDataHealthStatus';
import { generatePath } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { InstanceAbility, InstanceRO } from 'common/generated_definitions';
import { SHUTDOWN_ID } from '../actions';
import { FormattedMessage } from 'react-intl';

export type EnrichedInstanceRO = InstanceRO & {
  displayName: string;
  applicationAbilities?: InstanceAbility[];
};

export const applicationInstanceEntity: Entity<EnrichedInstanceRO> = {
  id: 'applicationInstance',
  columns: [
    {
      id: 'displayName',
      type: 'Text',
      labelId: 'name',
      getTooltip: (item) => item.actuatorUrl,
    },
    {
      id: 'metadata.version',
      type: 'Text',
      labelId: 'version',
    },
    {
      id: 'metadata.buildTime',
      type: 'Date',
      labelId: 'buildTime',
    },
    {
      id: 'metadata.gitBranch',
      type: 'Text',
      labelId: 'gitBranch',
      width: 150,
    },
    {
      id: 'metadata.gitCommitId',
      type: 'Text',
      labelId: 'gitCommit',
      width: 150,
    },
    {
      id: 'health.status',
      type: 'Custom',
      labelId: 'healthStatus',
      width: 150,
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
      id: 'displayName',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.displayName?.toLowerCase().includes(filter.toLowerCase()) ||
        item.metadata?.version?.toLowerCase().includes(filter.toLowerCase()) ||
        item.metadata?.gitBranch?.toLowerCase().includes(filter.toLowerCase()) ||
        item.metadata?.gitCommitId?.toLowerCase().includes(filter.toLowerCase())
    ),
};
