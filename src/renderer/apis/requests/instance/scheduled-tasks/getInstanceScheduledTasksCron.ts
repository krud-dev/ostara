import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ScheduledTasksActuatorResponse$Cron } from '../../../../../common/generated_definitions';
import { getInstanceScheduledTasks } from './getInstanceScheduledTasks';

type Variables = {
  instanceId: string;
};

type Data = ScheduledTasksActuatorResponse$Cron[];

export const getInstanceScheduledTasksCron = async (variables: Variables): Promise<Data> => {
  return (await getInstanceScheduledTasks(variables)).cron;
};

export const useGetInstanceScheduledTasksCron = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceScheduledTasksCron, options);

export const useGetInstanceScheduledTasksCronQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemScheduledTasksCron(variables.instanceId),
    getInstanceScheduledTasksCron,
    variables,
    options
  );
