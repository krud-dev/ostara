import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { InstanceAbility } from '../../../../common/generated_definitions';

type Variables = {
  applicationId: string;
};

type Data = InstanceAbility[];

export const getApplicationAbilities = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`applications/${variables.applicationId}/abilities`)).data;
};

export const useGetApplicationAbilities = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationAbilities, options);

export const useGetApplicationAbilitiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemAbilities(variables.applicationId),
    getApplicationAbilities,
    variables,
    options
  );
