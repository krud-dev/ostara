import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { TogglzFeatureActuatorResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';

export type EnrichedTogglzFeature = TogglzFeatureActuatorResponse & {
  instanceId: string;
};

type Variables = {
  instanceId: string;
  group?: string;
};

type Data = EnrichedTogglzFeature[];

export const getInstanceTogglz = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<TogglzFeatureActuatorResponse[], AxiosResponse<TogglzFeatureActuatorResponse[]>>(
      `actuator/togglz?instanceId=${variables.instanceId}`
    )
  ).data;
  return result
    .filter((togglz) => !variables.group || togglz.metadata?.groups?.includes(variables.group))
    .map((togglz) => ({ ...togglz, instanceId: variables.instanceId }));
};

export const useGetInstanceTogglz = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceTogglz, options);

export const useGetInstanceTogglzQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    variables.group
      ? apiKeys.itemTogglzByGroup(variables.instanceId, variables.group)
      : apiKeys.itemTogglz(variables.instanceId),
    getInstanceTogglz,
    variables,
    options
  );
