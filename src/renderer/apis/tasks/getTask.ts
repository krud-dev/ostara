import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { TaskDefinitionDisplay } from 'infra/tasks/types';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = { name: string };

type Data = TaskDefinitionDisplay | undefined;

export const getTask = async (variables: Variables): Promise<Data> => {
  return await window.task.getTaskForDisplay(variables.name);
};

export const useGetTask = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getTask, options);

export const useGetTaskQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> => useBaseQuery<Data, Variables>(apiKeys.task(variables.name), getTask, variables, options);
