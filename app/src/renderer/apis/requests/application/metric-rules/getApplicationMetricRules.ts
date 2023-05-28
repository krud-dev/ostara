import { BaseQueryOptions, BaseUseQueryResult, useBaseQuery } from '../../base/useBaseQuery';
import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from 'renderer/apis/apiKeys';
import { ApplicationMetricRuleRO } from '../../../../../common/generated_definitions';
import { crudSearch } from '../../crud/crudSearch';
import { metricRuleCrudEntity } from '../../crud/entity/entities/metricRule.crudEntity';

type Variables = {
  applicationId: string;
};

type Data = ApplicationMetricRuleRO[];

export const getApplicationMetricRules = async (variables: Variables): Promise<Data> => {
  const result = await crudSearch<ApplicationMetricRuleRO>({
    entity: metricRuleCrudEntity,
    filterFields: [{ fieldName: 'applicationId', operation: 'Equal', values: [variables.applicationId] }],
    orders: [{ by: 'creationTime', descending: true }],
    currentPage: 1,
    pageSize: 10000,
  });
  return result.results;
};

export const useGetApplicationMetricRules = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(getApplicationMetricRules, options);

export const useGetApplicationMetricRulesQuery = (
  variables: Variables,
  options?: BaseQueryOptions<Data, Variables>
): BaseUseQueryResult<Data> =>
  useBaseQuery<Data, Variables>(
    apiKeys.itemMetricRules(variables.applicationId),
    getApplicationMetricRules,
    variables,
    options
  );
