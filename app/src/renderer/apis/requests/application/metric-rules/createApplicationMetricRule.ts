import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from '../../../apiKeys';
import { crudKeys } from '../../crud/crudKeys';
import { metricRuleCrudEntity } from '../../crud/entity/entities/metricRule.crudEntity';
import {
  ApplicationMetricRuleCreateRequestRO,
  ApplicationMetricRuleRO,
} from '../../../../../common/generated_definitions';
import { crudCreate } from '../../crud/crudCreate';

type Variables = {
  metricRule: ApplicationMetricRuleCreateRequestRO;
};

type Data = ApplicationMetricRuleRO;

export const createApplicationMetricRule = async (variables: Variables): Promise<Data> => {
  return await crudCreate<ApplicationMetricRuleRO, ApplicationMetricRuleCreateRequestRO>({
    entity: metricRuleCrudEntity,
    item: variables.metricRule,
  });
};

export const useCreateApplicationMetricRule = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(createApplicationMetricRule, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      apiKeys.itemMetricRules(variables.metricRule.applicationId),
      crudKeys.entity(metricRuleCrudEntity),
    ],
  });
