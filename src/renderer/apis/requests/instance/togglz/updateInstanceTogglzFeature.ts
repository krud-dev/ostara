import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { InstanceLoggerRO } from '../../../../../common/generated_definitions';

type Variables = {
  instanceId: string;
  featureName: string;
  enabled: boolean;
};

type Data = InstanceLoggerRO;

export const updateInstanceTogglzFeature = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.post<Data, AxiosResponse<Data>, null>(`actuator/togglz/${variables.featureName}`, null, {
      params: { instanceId: variables.instanceId, enabled: variables.enabled },
    })
  ).data;
};

export const useUpdateInstanceTogglzFeature = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateInstanceTogglzFeature, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => apiKeys.itemTogglz(variables.instanceId),
  });
