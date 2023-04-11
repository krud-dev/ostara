import { Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import React, { useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import InstanceHttpRequestCharts, {
  InstanceHttpRequestChartsData,
} from 'renderer/pages/navigator/instance/http-requests/components/InstanceHttpRequestCharts';
import { useGetInstanceHttpRequestStatisticsForUriByMethodsQuery } from 'renderer/apis/requests/instance/http-requests/getInstanceHttpRequestStatisticsForUriByMethods';
import { useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery } from 'renderer/apis/requests/instance/http-requests/getInstanceHttpRequestStatisticsForUriByOutcomes';
import { useGetInstanceHttpRequestStatisticsForUriByStatusesQuery } from 'renderer/apis/requests/instance/http-requests/getInstanceHttpRequestStatisticsForUriByStatuses';
import { useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery } from 'renderer/apis/requests/instance/http-requests/getInstanceHttpRequestStatisticsForUriByExceptions';
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
    () =>
      methodsState.data
        ? map(methodsState.data, (statistics, method) => ({ label: method, statistics: statistics }))
        : undefined,
    [methodsState.data]
  );

  const statusesState = useGetInstanceHttpRequestStatisticsForUriByStatusesQuery({ instanceId: item.id, uri: row.uri });
  const statusesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () =>
      statusesState.data
        ? map(statusesState.data, (statistics, method) => ({ label: method, statistics: statistics }))
        : undefined,
    [statusesState.data]
  );

  const outcomesState = useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery({ instanceId: item.id, uri: row.uri });
  const outcomesData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () =>
      outcomesState.data
        ? map(outcomesState.data, (statistics, method) => ({ label: method, statistics: statistics }))
        : undefined,
    [outcomesState.data]
  );

  const exceptionsState = useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery({
    instanceId: item.id,
    uri: row.uri,
  });
  const exceptionsData = useMemo<InstanceHttpRequestChartsData | undefined>(
    () =>
      exceptionsState.data
        ? map(exceptionsState.data, (statistics, method) => ({ label: method, statistics: statistics }))
        : undefined,
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
