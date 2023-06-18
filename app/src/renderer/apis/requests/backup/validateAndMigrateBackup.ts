import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';
import { BackupDTO } from 'common/generated_definitions';
import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import { apiKeys } from 'renderer/apis/apiKeys';

type Variables = {
  jsonData: string;
};

type Data = BackupDTO;

export const validateAndMigrateBackup = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, string>(`backup/validateAndMigrate`, variables.jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).data;
};

export const useValidateAndMigrateBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(validateAndMigrateBackup, options);

export const useValidateAndMigrateBackupQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.backupsPreview(variables.jsonData),
    validateAndMigrateBackup,
    variables,
    options
  );
