import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ScheduledTasksActuatorResponse$FixedDelayOrRate } from '../../../../../common/generated_definitions';
import { getInstanceScheduledTasks } from './getInstanceScheduledTasks';

export type ScheduleTasksFixedType = 'Delay' | 'Rate';

type Variables = {
  instanceId: string;
  type: ScheduleTasksFixedType;
};

type Data = ScheduledTasksActuatorResponse$FixedDelayOrRate[];

export const getInstanceScheduledTasksFixed = async (variables: Variables): Promise<Data> => {
  const result = await getInstanceScheduledTasks(variables);
  return variables.type === 'Delay' ? result.fixedDelay : result.fixedRate;
};

export const useGetInstanceScheduledTasksFixed = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceScheduledTasksFixed, options);

export const useGetInstanceScheduledTasksFixedQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemScheduledTasksFixed(variables.instanceId, variables.type),
    getInstanceScheduledTasksFixed,
    variables,
    options
  );
