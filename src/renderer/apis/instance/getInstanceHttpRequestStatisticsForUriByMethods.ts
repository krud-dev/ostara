import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsByMethod } from 'infra/instance/models/httpRequestStatistics';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = InstanceHttpRequestStatisticsByMethod[];

export const getInstanceHttpRequestStatisticsForUriByMethods = async (variables: Variables): Promise<Data> => {
  return await window.instance.httpRequestStatisticsService.getStatisticsForUriByMethods(
    variables.instanceId,
    variables.uri
  );
};

export const useGetInstanceHttpRequestStatisticsForUriByMethods = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatisticsForUriByMethods, options);

export const useGetInstanceHttpRequestStatisticsForUriByMethodsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatisticsForUriByMethods(variables.instanceId, variables.uri),
    getInstanceHttpRequestStatisticsForUriByMethods,
    variables,
    options
  );
