import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../../axiosInstance';
import { AxiosResponse } from 'axios';
import { apiKeys } from '../../../apiKeys';
import { crudKeys } from '../../crud/crudKeys';
import { metricRuleCrudEntity } from '../../crud/entity/entities/metricRule.crudEntity';

type Variables = {
  applicationId: string;
  metricRuleId: string;
};

type Data = void;

export const deleteApplicationMetricRule = async (variables: Variables): Promise<Data> => {
  return (
    await axiosInstance.delete<Data, AxiosResponse<Data>>(`${metricRuleCrudEntity.path}/${variables.metricRuleId}`)
  ).data;
};

export const useDeleteApplicationMetricRule = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(deleteApplicationMetricRule, {
    ...options,
    invalidateQueriesKeysFn: (data, variables) => [
      apiKeys.itemMetricRules(variables.applicationId),
      crudKeys.entity(metricRuleCrudEntity),
    ],
  });
