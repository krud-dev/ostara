import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsByOutcome } from 'infra/instance/models/httpRequestStatistics';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = InstanceHttpRequestStatisticsByOutcome[];

export const getInstanceHttpRequestStatisticsForUriByOutcomes = async (variables: Variables): Promise<Data> => {
  return await window.instance.httpRequestStatisticsService.getStatisticsForUriByOutcomes(
    variables.instanceId,
    variables.uri
  );
};

export const useGetInstanceHttpRequestStatisticsForUriByOutcomes = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceHttpRequestStatisticsForUriByOutcomes, options);

export const useGetInstanceHttpRequestStatisticsForUriByOutcomesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemHttpRequestStatisticsForUriByOutcomes(variables.instanceId, variables.uri),
    getInstanceHttpRequestStatisticsForUriByOutcomes,
    variables,
    options
  );
