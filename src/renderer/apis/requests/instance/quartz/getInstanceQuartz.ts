import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { QuartzActuatorResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
};

type Data = QuartzActuatorResponse;

export const getInstanceQuartz = async (variables: Variables): Promise<Data> => {
  return (await axiosInstance.get<Data, AxiosResponse<Data>>(`actuator/quartz?instanceId=${variables.instanceId}`))
    .data;
};

export const useGetInstanceQuartz = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceQuartz, options);

export const useGetInstanceQuartzQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(apiKeys.itemQuartz(variables.instanceId), getInstanceQuartz, variables, options);
