import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationHealthRO } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {};

type Data = { [key: string]: ApplicationHealthRO };

export const getApplicationsHealth = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`applications/health/allCached`)).data;
};

export const useGetApplicationsHealth = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationsHealth, options);

export const useGetApplicationsHealthQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.applicationsHealth(), getApplicationsHealth, variables, options);
