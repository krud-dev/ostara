import { CrudQueryOptions, CrudUseQueryResult, useCrudQuery } from './base/useCrudQuery';
import {
  CrudMutationOptions,
  CrudUseMutationResult,
  CrudVariables,
  useCrudMutation,
  useCrudReadMutation,
} from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';
import { BaseRO } from './entity/entity';
import { crudKeys } from './crudKeys';
import { FilterField, OrderDTO, PagedResult } from '../../../../common/generated_definitions';

export type CrudSearchVariables = CrudVariables & {
  currentPage?: number;
  pageSize?: number;
  filterFields?: FilterField[];
  orders?: OrderDTO[];
};

export type CrudSearchData<ResponseRO> = PagedResult<ResponseRO>;

export const crudSearch = async <ResponseRO extends BaseRO>(
  variables: CrudSearchVariables
): Promise<CrudSearchData<ResponseRO>> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).search(entity, rest);
};

export const useCrudSearch = <ResponseRO extends BaseRO>(
  options?: CrudMutationOptions<CrudSearchData<ResponseRO>, CrudSearchVariables>
): CrudUseMutationResult<CrudSearchData<ResponseRO>, CrudSearchVariables> => {
  return useCrudReadMutation<CrudSearchData<ResponseRO>, CrudSearchVariables>(crudSearch, options);
};

export const useCrudSearchQuery = <ResponseRO extends BaseRO>(
  variables: CrudSearchVariables,
  options?: CrudQueryOptions<CrudSearchData<ResponseRO>, CrudSearchVariables>
): CrudUseQueryResult<CrudSearchData<ResponseRO>> => {
  const { entity, ...vars } = variables;
  return useCrudQuery<CrudSearchData<ResponseRO>, CrudSearchVariables>(
    crudKeys.entityItems(entity, vars),
    crudSearch,
    variables,
    options
  );
};
