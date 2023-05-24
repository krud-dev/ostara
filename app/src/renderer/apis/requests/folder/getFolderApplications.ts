import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationRO } from '../../../../common/generated_definitions';
import { crudSearch } from '../crud/crudSearch';
import { applicationCrudEntity } from '../crud/entity/entities/application.crudEntity';

type Variables = {
  folderIds: string[];
};

type Data = ApplicationRO[];

export const getFolderApplications = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<ApplicationRO>({
    entity: applicationCrudEntity,
    filterFields: [{ fieldName: 'parentFolderId', operation: 'In', values: variables.folderIds }],
  });
  return result.results;
};

export const useGetFolderApplications = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getFolderApplications, options);

export const useGetFolderApplicationsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemApplications(variables.folderIds),
    getFolderApplications,
    variables,
    options
  );
