import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { TogglzFeatureActuatorResponse } from '../../../../../common/generated_definitions';
import { EnrichedTogglzFeature } from './getInstanceTogglz';

type Variables = {
  instanceId: string;
  featureName: string;
  enabled: boolean;
};

type Data = EnrichedTogglzFeature;

export const updateInstanceTogglzFeature = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.post<TogglzFeatureActuatorResponse, AxiosResponse<TogglzFeatureActuatorResponse>, null>(
      `actuator/togglz/${variables.featureName}`,
      null,
      {
        params: { instanceId: variables.instanceId, enabled: variables.enabled },
      }
    )
  ).data;
  return { ...result, instanceId: variables.instanceId };
};

export const useUpdateInstanceTogglzFeature = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateInstanceTogglzFeature, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemTogglz(variables.instanceId),
  });
