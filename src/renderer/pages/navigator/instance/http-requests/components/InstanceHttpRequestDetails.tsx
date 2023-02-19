import { Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import React, { useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import InstanceHttpRequestCharts, {
  InstanceHttpRequestChartsData,
} from 'renderer/pages/navigator/instance/http-requests/components/InstanceHttpRequestCharts';
import { useGetInstanceHttpRequestStatisticsForUriByMethodsQuery } from 'renderer/apis/requests/instance/getInstanceHttpRequestStatisticsForUriByMethods';
import { useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery } from 'renderer/apis/requests/instance/getInstanceHttpRequestStatisticsForUriByOutcomes';
import { useGetInstanceHttpRequestStatisticsForUriByStatusesQuery } from 'renderer/apis/requests/instance/getInstanceHttpRequestStatisticsForUriByStatuses';
import { useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery } from 'renderer/apis/requests/instance/getInstanceHttpRequestStatisticsForUriByExceptions';
import { InstanceHttpRequestStatisticsRO, InstanceRO } from '../../../../../../common/generated_definitions';
import { map } from 'lodash';

type InstanceBeanDetailsProps = {
  row: InstanceHttpRequestStatisticsRO;
};

export default function InstanceHttpRequestDetails({ row }: InstanceBeanDetailsProps) {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const methodsState = useGetInstanceHttpRequestStatisticsForUriByMethodsQuery({ instanceId: item.id, uri: row.uri });
  const methodsData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => map(methodsState.data, (statistics, method) => ({ label: method, statistics: statistics })),
    [methodsState.data]
  );

  const statusesState = useGetInstanceHttpRequestStatisticsForUriByStatusesQuery({ instanceId: item.id, uri: row.uri });
  const statusesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => map(statusesState.data, (statistics, method) => ({ label: method, statistics: statistics })),
    [statusesState.data]
  );

  const outcomesState = useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery({ instanceId: item.id, uri: row.uri });
  const outcomesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => map(outcomesState.data, (statistics, method) => ({ label: method, statistics: statistics })),
    [outcomesState.data]
  );

  const exceptionsState = useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery({
    instanceId: item.id,
    uri: row.uri,
  });
  const exceptionsData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () => map(exceptionsState.data, (statistics, method) => ({ label: method, statistics: statistics })),
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
