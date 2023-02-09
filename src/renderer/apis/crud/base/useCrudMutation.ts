import { MutationFunction } from '@tanstack/react-query';
import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from '../../base/useBaseMutation';
import { CrudEntity } from '../entity/entity';
import { crudKeys } from '../crudKeys';

export type CrudVariables = { entity: CrudEntity };

export type CrudMutationOptions<Data, Variables extends CrudVariables> = Omit<
  BaseMutationOptions<Data, Variables>,
  'invalidateQueriesKeyFn'
>;

export type CrudUseMutationResult<Data, Variables extends CrudVariables> = BaseUseMutationResult<Data, Variables>;

export const useCrudMutation = <Data, Variables extends CrudVariables>(
  mutationFn: MutationFunction<Data, Variables>,
  options?: CrudMutationOptions<Data, Variables>
): CrudUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(mutationFn, {
    ...options,
    invalidateQueriesKeyFn: (data, variables) => crudKeys.entity(variables.entity),
  });
