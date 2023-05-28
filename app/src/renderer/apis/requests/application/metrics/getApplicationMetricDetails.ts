import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { MetricActuatorResponse } from '../../../../../common/generated_definitions';
import { getApplicationInstances } from '../getApplicationInstances';
import { isEmpty } from 'lodash';
import { getInstanceMetricDetails } from '../../instance/metrics/getInstanceMetricDetails';

type Variables = {
  applicationId: string;
  name: string;
  tags?: { [key: string]: string };
};

type Data = MetricActuatorResponse;

export const getApplicationMetricDetails = async (variables: Variables): Promise<Data> => {
  const applicationInstances = await getApplicationInstances({ applicationId: variables.applicationId, pageSize: 1 });
  if (isEmpty(applicationInstances)) {
    throw new Error('No application instances found');
  }
  return await getInstanceMetricDetails({
    instanceId: applicationInstances[0].id,
    name: variables.name,
    tags: variables.tags,
  });
};

export const useGetApplicationMetricDetails = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationMetricDetails, options);

export const useGetApplicationMetricDetailsQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMetricDetails(variables.applicationId, variables.name, variables.tags),
    getApplicationMetricDetails,
    variables,
    options
  );
