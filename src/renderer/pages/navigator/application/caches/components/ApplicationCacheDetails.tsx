import React, { ReactNode, useCallback, useMemo } from 'react';
import { ApplicationCache, ApplicationCacheStatistics } from 'infra/instance/models/cache';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { EnrichedApplication, EnrichedInstance } from 'infra/configuration/model/configuration';
import { useGetApplicationCacheStatisticsQuery } from 'renderer/apis/application/getApplicationCacheStatistics';
import { chain, get, sumBy } from 'lodash';
import ItemCacheDetails, { ItemCacheStatistics } from 'renderer/components/item/cache/ItemCacheDetails';
import { useGetApplicationInstancesQuery } from 'renderer/apis/application/getApplicationInstances';
import { Stack } from '@mui/material';
import TableDetailsLabelValue from 'renderer/components/table/details/TableDetailsLabelValue';
import { FormattedMessage } from 'react-intl';

type ApplicationCacheDetailsProps = {
  row: ApplicationCache;
};

export default function ApplicationCacheDetails({ row }: ApplicationCacheDetailsProps) {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedApplication>(() => selectedItem as EnrichedApplication, [selectedItem]);

  const statisticsQuery = useGetApplicationCacheStatisticsQuery({ applicationId: item.id, cacheName: row.name });
  const instancesQuery = useGetApplicationInstancesQuery({ applicationId: item.id });

  const getValueTooltip = useCallback(
    (name: string): ReactNode | undefined => {
      return statisticsQuery.data && instancesQuery.data ? (
        <ValueTooltip name={name} applicationStatistics={statisticsQuery.data} instances={instancesQuery.data} />
      ) : undefined;
    },
    [statisticsQuery.data, instancesQuery.data]
  );

  const statistics = useMemo<ItemCacheStatistics | undefined>(() => {
    if (!statisticsQuery.data) {
      return undefined;
    }
    const instanceStatistics = chain(statisticsQuery.data).values().value();
    return {
      gets: {
        value: sumBy(instanceStatistics, (s) => s.gets),
        tooltip: getValueTooltip('gets'),
      },
      puts: {
        value: sumBy(instanceStatistics, (s) => s.puts),
        tooltip: getValueTooltip('puts'),
      },
      evictions: {
        value: sumBy(instanceStatistics, (s) => s.evictions),
        tooltip: getValueTooltip('evictions'),
      },
      hits: {
        value: sumBy(instanceStatistics, (s) => s.hits),
        tooltip: getValueTooltip('hits'),
      },
      misses: {
        value: sumBy(instanceStatistics, (s) => s.misses),
        tooltip: getValueTooltip('misses'),
      },
      removals: {
        value: sumBy(instanceStatistics, (s) => s.removals),
        tooltip: getValueTooltip('removals'),
      },
      size: {
        value: sumBy(instanceStatistics, (s) => s.size),
        tooltip: getValueTooltip('size'),
      },
    };
  }, [statisticsQuery.data, instancesQuery.data]);

  return <ItemCacheDetails statistics={statistics} />;
}

type ValueTooltipProps = {
  name: string;
  applicationStatistics: ApplicationCacheStatistics;
  instances: EnrichedInstance[];
};

function ValueTooltip({ name, applicationStatistics, instances }: ValueTooltipProps) {
  const values = useMemo<{ id: string; label: ReactNode; value: number }[]>(
    () =>
      chain(applicationStatistics)
        .map((instanceStatistics, instanceId) => ({
          id: instanceId,
          label: instances.find((i) => i.id === instanceId)?.alias || <FormattedMessage id={'notAvailable'} />,
          value: get(instanceStatistics, name) || 0,
        }))
        .value(),
    [name, applicationStatistics, instances]
  );

  return (
    <Stack direction={'column'} spacing={1}>
      {values.map((v) => (
        <TableDetailsLabelValue label={v.label} value={v.value} key={v.id} />
      ))}
    </Stack>
  );
}
