import { CrudQueryOptions, CrudUseQueryResult, useCrudQuery } from './base/useCrudQuery';
import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';
import { crudKeys } from './crudKeys';
import { CountResultRO, FilterField } from '../../../../common/generated_definitions';

export type CrudSearchCountVariables = CrudVariables & {
  filterFields?: FilterField[];
};

export type CrudSearchCountData = CountResultRO;

export const crudSearchCount = async (variables: CrudSearchCountVariables): Promise<CrudSearchCountData> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).searchCount(entity, rest);
};

export const useCrudSearchCount = (
  variables: CrudSearchCountVariables,
  options?: CrudMutationOptions<CrudSearchCountData, CrudSearchCountVariables>
): CrudUseMutationResult<CrudSearchCountData, CrudSearchCountVariables> => {
  return useCrudMutation<CrudSearchCountData, CrudSearchCountVariables>(crudSearchCount, options);
};

export const useCrudSearchCountQuery = (
  variables: CrudSearchCountVariables,
  options?: CrudQueryOptions<CrudSearchCountData, CrudSearchCountVariables>
): CrudUseQueryResult<CrudSearchCountData> => {
  const { entity, ...vars } = variables;
  return useCrudQuery<CrudSearchCountData, CrudSearchCountVariables>(
    crudKeys.entityItemsCount(entity, vars),
    crudSearchCount,
    variables,
    options
  );
};
