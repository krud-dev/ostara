import { Folder } from 'infra/configuration/model/configuration';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/base/useBaseMutation';

type Variables = {
  id: string;
  folder: Omit<Folder, 'id' | 'type'>;
};

type Data = Folder;

export const updateFolder = async (variables: Variables): Promise<Data> => {
  return await window.configuration.updateFolder(
    variables.id,
    variables.folder
  );
};

export const useUpdateFolder = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateFolder, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => ['configuration'],
  });
