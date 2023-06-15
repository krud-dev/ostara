import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { AxiosResponse } from 'axios';
import { SystemBackupRO } from 'common/generated_definitions';
import { axiosInstance } from 'renderer/apis/axiosInstance';

type Variables = {};

type Data = SystemBackupRO;

export const createSystemBackup = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.post<Data, AxiosResponse<Data>, null>(`systemBackup/create`)).data;
};

export const useCreateSystemBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createSystemBackup, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.systemBackups(),
  });
