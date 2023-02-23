import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHttpRequestStatisticsRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  uri: string;
};

type Data = { [key: number]: InstanceHttpRequestStatisticsRO };

export const getInstanceHttpRequestStatisticsForUriByStatuses = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `instances/${variables.instanceId}/httpRequestStatistics/statuses?uri=${encodeURIComponent(variables.uri)}`
    )
  ).data;
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
