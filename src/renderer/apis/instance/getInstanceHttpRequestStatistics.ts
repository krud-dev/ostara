import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatistics } from 'infra/instance/models/httpRequestStatistics';

type Variables = {
  instanceId: string;
};

type Data = InstanceHttpRequestStatistics[];

export const getInstanceHttpRequestStatistics = async (variables: Variables): Promise<Data> => {
  return await window.instance.httpRequestStatisticsService.getStatistics(variables.instanceId);
};

export const useGetInstanceHttpRequestStatistics = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatistics, options);

export const useGetInstanceHttpRequestStatisticsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatistics(variables.instanceId),
    getInstanceHttpRequestStatistics,
    variables,
    options
  );
