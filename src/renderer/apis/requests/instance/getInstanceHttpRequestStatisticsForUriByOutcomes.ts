import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsRO } from '../../../../common/generated_definitions';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = { [key: string]: InstanceHttpRequestStatisticsRO };

export const getInstanceHttpRequestStatisticsForUriByOutcomes = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instances/${variables.instanceId}/httpRequestStatistics/outcomes?uri=${encodeURIComponent(variables.uri)}`
    )
  ).data;
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
