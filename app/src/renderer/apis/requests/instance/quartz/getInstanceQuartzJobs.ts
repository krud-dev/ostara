import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { QuartzJobsResponse } from '../../../../../common/generated_definitions';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { map } from 'lodash';

export type EnrichedQuartzJob = { name: string; instanceId: string; group: string };

type Variables = {
  instanceId: string;
};

type Data = EnrichedQuartzJob[];

export const getInstanceQuartzJobs = async (variables: Variables): Promise<Data> => {
  const result = (
    await axiosInstance.get<QuartzJobsResponse, AxiosResponse<QuartzJobsResponse>>(
      `actuator/quartz/jobs?instanceId=${variables.instanceId}`
    )
  ).data;
  return map(result.groups, (groupJobs, group) =>
    groupJobs.jobs.map<EnrichedQuartzJob>((job) => ({
      name: job,
      instanceId: variables.instanceId,
      group: group,
    }))
  ).flat();
};

export const useGetInstanceQuartzJobs = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getInstanceQuartzJobs, options);

export const useGetInstanceQuartzJobsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemQuartzJobs(variables.instanceId),
    getInstanceQuartzJobs,
    variables,
    options
  );
