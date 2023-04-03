import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { PagedResult, ThreadProfilingLogRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  requestId: string;
};

type Data = PagedResult<ThreadProfilingLogRO>;

export const getInstanceThreadProfilingRequestLogs = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`threadprofiling/${variables.requestId}/log`)).data;
};

export const useGetInstanceThreadProfilingRequestLogs = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceThreadProfilingRequestLogs, options);

export const useGetInstanceThreadProfilingRequestLogsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemThreadProfilingRequestLogs(variables.instanceId, variables.requestId),
    getInstanceThreadProfilingRequestLogs,
    variables,
    options
  );
