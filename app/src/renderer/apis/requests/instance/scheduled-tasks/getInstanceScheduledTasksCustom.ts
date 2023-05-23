import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ScheduledTasksActuatorResponse$Custom } from '../../../../../common/generated_definitions';
import { getInstanceScheduledTasks } from './getInstanceScheduledTasks';

type Variables = {
  instanceId: string;
};

type Data = ScheduledTasksActuatorResponse$Custom[];

export const getInstanceScheduledTasksCustom = async (variables: Variables): Promise<Data> => {
  return (await getInstanceScheduledTasks(variables)).custom;
};

export const useGetInstanceScheduledTasksCustom = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceScheduledTasksCustom, options);

export const useGetInstanceScheduledTasksCustomQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemScheduledTasksCustom(variables.instanceId),
    getInstanceScheduledTasksCustom,
    variables,
    options
  );
