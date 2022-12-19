import { Folder } from 'infra/configuration/model/configuration';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/base/useBaseMutation';

type Variables = {
  folder: Omit<Folder, 'id' | 'type'>;
};

type Data = Folder;

export const createFolder = async (variables: Variables): Promise<Data> => {
  return await window.configuration.createFolder(variables.folder);
};

export const useCreateFolder = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createFolder, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
