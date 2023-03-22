import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { EffectiveAuthentication } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  folderId: string;
};

type Data = EffectiveAuthentication;

export const getFolderEffectiveAuthentication = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`folders/${variables.folderId}/authentication/effective`))
    .data;
};

export const useGetFolderEffectiveAuthentication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getFolderEffectiveAuthentication, options);

export const useGetFolderEffectiveAuthenticationQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemEffectiveAuthentication(variables.folderId),
    getFolderEffectiveAuthentication,
    variables,
    options
  );
