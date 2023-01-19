import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import {
  InstanceHttpRequestStatisticsByMethod,
  InstanceHttpRequestStatisticsByStatus
} from 'infra/instance/models/httpRequestStatistics';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = InstanceHttpRequestStatisticsByStatus[];

export const getInstanceHttpRequestStatisticsForUriByStatuses = async (variables: Variables): Promise<Data> => {
  return await window.instance.httpRequestStatisticsService.getStatisticsForUriByStatuses(
    variables.instanceId,
    variables.uri
  );
};

export const useGetInstanceHttpRequestStatisticsForUriByStatuses = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatisticsForUriByStatuses, options);

export const useGetInstanceHttpRequestStatisticsForUriByStatusesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatisticsForUriByStatuses(variables.instanceId, variables.uri),
    getInstanceHttpRequestStatisticsForUriByStatuses,
    variables,
    options
  );
