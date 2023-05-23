import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { InstanceHttpRequestStatisticsRO } from '../../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = { [key: string]: InstanceHttpRequestStatisticsRO };

export const getInstanceHttpRequestStatisticsForUriByExceptions = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instances/${variables.instanceId}/httpRequestStatistics/exceptions?uri=${encodeURIComponent(variables.uri)}`
    )
  ).data;
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
