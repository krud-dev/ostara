import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { apiKeys } from '../../../apiKeys';
import { crudKeys } from '../../crud/crudKeys';
import { metricRuleCrudEntity } from '../../crud/entity/entities/metricRule.crudEntity';
import {
  ApplicationMetricRuleModifyRequestRO,
  ApplicationMetricRuleRO,
} from '../../../../../common/generated_definitions';
import { crudUpdate } from '../../crud/crudUpdate';

type Variables = {
  id: string;
  applicationId: string;
  metricRule: ApplicationMetricRuleModifyRequestRO;
};

type Data = ApplicationMetricRuleRO;

export const updateApplicationMetricRule = async (variables: Variables): Promise<Data> => {
  return await crudUpdate<ApplicationMetricRuleRO, ApplicationMetricRuleModifyRequestRO>({
    entity: metricRuleCrudEntity,
    id: variables.id,
    item: variables.metricRule,
  });
};

export const useUpdateApplicationMetricRule = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(updateApplicationMetricRule, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      apiKeys.itemMetricRules(variables.applicationId),
      crudKeys.entity(metricRuleCrudEntity),
    ],
  });
