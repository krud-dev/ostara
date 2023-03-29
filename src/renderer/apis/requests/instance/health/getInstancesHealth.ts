import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { InstanceHealthRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {};

type Data = { [key: string]: InstanceHealthRO };

export const getInstancesHealth = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`instances/health/allCached`)).data;
};

export const useGetInstancesHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstancesHealth, options);

export const useGetInstancesHealthQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.instancesHealth(), getInstancesHealth, variables, options);
