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
  applicationId: string;
};

type Data = EffectiveAuthentication;

export const getApplicationEffectiveAuthentication = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `applications/${variables.applicationId}/authentication/effective`
    )
  ).data;
};

export const useGetApplicationEffectiveAuthentication = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(getApplicationEffectiveAuthentication, options);

export const useGetApplicationEffectiveAuthenticationQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemEffectiveAuthentication(variables.applicationId),
    getApplicationEffectiveAuthentication,
    variables,
    options
  );
