import { Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import React, { useMemo } from 'react';
import { InstanceHttpRequestStatistics } from 'infra/instance/models/httpRequestStatistics';
import { useGetInstanceHttpRequestStatisticsForUriByMethodsQuery } from 'renderer/apis/instance/getInstanceHttpRequestStatisticsForUriByMethods';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import InstanceHttpRequestCharts, {
  InstanceHttpRequestChartsData,
} from 'renderer/pages/navigator/instance/http-requests/components/InstanceHttpRequestCharts';
import { useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery } from 'renderer/apis/instance/getInstanceHttpRequestStatisticsForUriByOutcomes';
import { useGetInstanceHttpRequestStatisticsForUriByStatusesQuery } from 'renderer/apis/instance/getInstanceHttpRequestStatisticsForUriByStatuses';
import { useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery } from 'renderer/apis/instance/getInstanceHttpRequestStatisticsForUriByExceptions';

type InstanceBeanDetailsProps = {
  row: InstanceHttpRequestStatistics;
};

export default function InstanceHttpRequestDetails({ row }: InstanceBeanDetailsProps) {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<EnrichedInstance>(() => selectedItem as EnrichedInstance, [selectedItem]);

  const methodsState = useGetInstanceHttpRequestStatisticsForUriByMethodsQuery({ instanceId: item.id, uri: row.uri });
  const methodsData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => methodsState.data?.map((v) => ({ label: v.method, statistics: v.statistics })),
    [methodsState.data]
  );

  const statusesState = useGetInstanceHttpRequestStatisticsForUriByStatusesQuery({ instanceId: item.id, uri: row.uri });
  const statusesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => statusesState.data?.map((v) => ({ label: v.status.toString(), statistics: v.statistics })),
    [statusesState.data]
  );

  const outcomesState = useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery({ instanceId: item.id, uri: row.uri });
  const outcomesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => outcomesState.data?.map((v) => ({ label: v.outcome, statistics: v.statistics })),
    [outcomesState.data]
  );

  const exceptionsState = useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery({
    instanceId: item.id,
    uri: row.uri,
  });
  const exceptionsData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => exceptionsState.data?.map((v) => ({ label: v.exception, statistics: v.statistics })),
    [exceptionsState.data]
  );

  return (
    <Stack direction={'column'} spacing={COMPONENTS_SPACING} sx={{ py: 2 }}>
      <InstanceHttpRequestCharts title={<FormattedMessage id={'methods'} />} data={methodsData} />
      <InstanceHttpRequestCharts title={<FormattedMessage id={'statuses'} />} data={statusesData} />
      <InstanceHttpRequestCharts title={<FormattedMessage id={'outcomes'} />} data={outcomesData} />
      <InstanceHttpRequestCharts title={<FormattedMessage id={'exceptions'} />} data={exceptionsData} />
    </Stack>
  );
}
