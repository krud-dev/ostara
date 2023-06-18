import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { AxiosResponse } from 'axios';
import { axiosInstance } from 'renderer/apis/axiosInstance';

type Variables = {
  fileName: string;
};

type Data = void;

export const deleteSystemBackup = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>, null>(
      `systemBackup/delete?fileName=${encodeURIComponent(variables.fileName)}`
    )
  ).data;
};

export const useDeleteSystemBackup = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteSystemBackup, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.systemBackups(),
  });
