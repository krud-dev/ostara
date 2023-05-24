import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { QuartzJobResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

type Variables = {
  instanceId: string;
  group: string;
  name: string;
};

type Data = QuartzJobResponse;

export const getInstanceQuartzJobDetails = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.get<Data, AxiosResponse<Data>>(
      `actuator/quartz/jobs/${variables.group}/${variables.name}?instanceId=${variables.instanceId}`
    )
  ).data;
};

export const useGetInstanceQuartzJobDetails = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceQuartzJobDetails, options);

export const useGetInstanceQuartzJobDetailsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemQuartzGroupJobDetails(variables.instanceId, variables.group, variables.name),
    getInstanceQuartzJobDetails,
    variables,
    options
  );
