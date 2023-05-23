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
  instanceId: string;
};

type Data = InstanceAbility[];

export const getInstanceAbilities = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`instances/${variables.instanceId}/abilities`)).data;
};

export const useGetInstanceAbilities = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceAbilities, options);

export const useGetInstanceAbilitiesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemAbilities(variables.instanceId), getInstanceAbilities, variables, options);
