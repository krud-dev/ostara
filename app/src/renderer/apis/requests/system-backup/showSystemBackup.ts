import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from 'renderer/apis/requests/base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { BackupDTO } from 'common/generated_definitions';
import { axiosInstance } from 'renderer/apis/axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = { fileName: string };

type Data = BackupDTO;

export const showSystemBackup = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `systemBackup/show?fileName=${encodeURIComponent(variables.fileName)}`
    )
  ).data;
};

export const useShowSystemBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(showSystemBackup, options);

export const useShowSystemBackupQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.systemBackupByFileName(variables.fileName),
    showSystemBackup,
    variables,
    options
  );
