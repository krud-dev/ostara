import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { HttpMethod, InstanceHttpRequestStatisticsRO } from '../../../../common/generated_definitions';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = { [key in HttpMethod]: InstanceHttpRequestStatisticsRO };

export const getInstanceHttpRequestStatisticsForUriByMethods = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instances/${variables.instanceId}/httpRequestStatistics/methods?uri=${encodeURIComponent(variables.uri)}`
    )
  ).data;
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
