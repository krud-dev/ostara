import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ScheduledTasksActuatorResponse$FixedDelayOrRate } from '../../../../../common/generated_definitions';
import { getInstanceScheduledTasks } from './getInstanceScheduledTasks';

type Variables = {
  instanceId: string;
};

type Data = ScheduledTasksActuatorResponse$FixedDelayOrRate[];

export const getInstanceScheduledTasksFixedDelay = async (variables: Variables): Promise<Data> => {
  return (await getInstanceScheduledTasks(variables)).fixedDelay;
};

export const useGetInstanceScheduledTasksFixedDelay = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getInstanceScheduledTasksFixedDelay, options);

export const useGetInstanceScheduledTasksFixedDelayQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemScheduledTasksFixedDelay(variables.instanceId),
    getInstanceScheduledTasksFixedDelay,
    variables,
    options
  );
