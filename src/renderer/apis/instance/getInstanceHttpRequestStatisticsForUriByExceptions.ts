import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsByException } from 'infra/instance/models/httpRequestStatistics';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = InstanceHttpRequestStatisticsByException[];

export const getInstanceHttpRequestStatisticsForUriByExceptions = async (variables: Variables): Promise<Data> => {
  return await window.instance.httpRequestStatisticsService.getStatisticsForUriByExceptions(
    variables.instanceId,
    variables.uri
  );
};

export const useGetInstanceHttpRequestStatisticsForUriByExceptions = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatisticsForUriByExceptions, options);

export const useGetInstanceHttpRequestStatisticsForUriByExceptionsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatisticsForUriByExceptions(variables.instanceId, variables.uri),
    getInstanceHttpRequestStatisticsForUriByExceptions,
    variables,
    options
  );
