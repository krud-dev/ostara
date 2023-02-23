import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { ScheduledTasksActuatorResponse } from '../../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
};

type Data = ScheduledTasksActuatorResponse;

export const getInstanceScheduledTasks = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(`actuator/scheduledtasks?instanceId=${variables.instanceId}`)
  ).data;
};

export const useGetInstanceScheduledTasks = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceScheduledTasks, options);

export const useGetInstanceScheduledTasksQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemScheduledTasks(variables.instanceId),
    getInstanceScheduledTasks,
    variables,
    options
  );
