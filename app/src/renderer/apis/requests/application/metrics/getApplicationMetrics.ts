import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { getApplicationInstances } from '../getApplicationInstances';
import { EnrichedInstanceMetric, getInstanceMetrics } from '../../instance/metrics/getInstanceMetrics';
import { isEmpty } from 'lodash';

export type EnrichedApplicationMetric = { applicationId: string } & EnrichedInstanceMetric;

type Variables = {
  applicationId: string;
};

type Data = EnrichedApplicationMetric[];

export const getApplicationMetrics = async (variables: Variables): Promise<Data> => {
  const applicationInstances = await getApplicationInstances({ applicationId: variables.applicationId, pageSize: 1 });
  if (isEmpty(applicationInstances)) {
    throw new Error('No application instances found');
  }
  const result = await getInstanceMetrics({ instanceId: applicationInstances[0].id });
  return result.map((m) => ({ ...m, applicationId: variables.applicationId }));
};

export const useGetApplicationMetrics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationMetrics, options);

export const useGetApplicationMetricsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMetrics(variables.applicationId),
    getApplicationMetrics,
    variables,
    options
  );
