import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { QuartzTriggerResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  group: string;
  name: string;
};

type Data = QuartzTriggerResponse;

export const getInstanceQuartzTriggerDetails = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `actuator/quartz/triggers/${variables.group}/${variables.name}?instanceId=${variables.instanceId}`
    )
  ).data;
};

export const useGetInstanceQuartzTriggerDetails = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceQuartzTriggerDetails, options);

export const useGetInstanceQuartzTriggerDetailsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemQuartzGroupTriggerDetails(variables.instanceId, variables.group, variables.name),
    getInstanceQuartzTriggerDetails,
    variables,
    options
  );
