import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { TaskDefinitionDisplay } from 'infra/tasks/types';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {};

type Data = TaskDefinitionDisplay[];

export const getTasks = async (variables: Variables): Promise<Data> => {
  return await window.task.getTasksForDisplay();
};

export const useGetTasks = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getTasks, options);

export const useGetTasksQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => useBaseQuery<Data, Variables>(apiKeys.tasks(), getTasks, variables, options);
