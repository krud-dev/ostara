import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { QuartzTriggersResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { map } from 'lodash';
import { EnrichedQuartzJob } from './getInstanceQuartzJobs';

export type EnrichedQuartzTrigger = { name: string; instanceId: string; group: string };

type Variables = {
  instanceId: string;
};

type Data = EnrichedQuartzTrigger[];

export const getInstanceQuartzTriggers = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<QuartzTriggersResponse, AxiosResponse<QuartzTriggersResponse>>(
      `actuator/quartz/triggers?instanceId=${variables.instanceId}`
    )
  ).data;
  return map(result.groups, (groupTriggers, group) =>
    groupTriggers.triggers.map<EnrichedQuartzJob>((trigger) => ({
      name: trigger,
      instanceId: variables.instanceId,
      group: group,
    }))
  ).flat();
};

export const useGetInstanceQuartzTriggers = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceQuartzTriggers, options);

export const useGetInstanceQuartzTriggersQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemQuartzTriggers(variables.instanceId),
    getInstanceQuartzTriggers,
    variables,
    options
  );
