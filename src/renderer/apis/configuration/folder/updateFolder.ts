import { EnrichedFolder, Folder } from 'infra/configuration/model/configuration';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  id: string;
  item: Omit<Folder, 'id' | 'type'>;
};

type Data = EnrichedFolder;

export const updateFolder = async (variables: Variables): Promise<Data> => {
  return await window.configuration.updateFolder(variables.id, variables.item);
};

export const useUpdateFolder = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateFolder, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.items(),
  });
