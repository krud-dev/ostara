import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { TaskName } from 'infra/tasks/types';
import { tasksKeys } from 'renderer/apis/tasks/tasksKeys';

type Variables = {
  name: TaskName;
};

type Data = void;

export const runTask = async (variables: Variables): Promise<Data> => {
  return await window.task.runTask(variables.name);
};

export const useRunTask = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(runTask, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => tasksKeys.tasks(),
  });
