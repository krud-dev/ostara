import { isNil } from 'lodash';
import { CrudQueryOptions, CrudUseQueryResult, useCrudQuery } from './base/useCrudQuery';
import { CrudMutationOptions, CrudUseMutationResult, CrudVariables, useCrudMutation } from './base/useCrudMutation';
import { getCrudMethods } from './types/crud';
import { BaseRO } from './entity/entity';
import { crudKeys } from './crudKeys';

export type CrudShowVariables = CrudVariables & {
  id: string;
};

export type CrudShowData<ResponseRO extends BaseRO> = ResponseRO;

export const crudShow = async <ResponseRO extends BaseRO>(
  variables: CrudShowVariables
): Promise<CrudShowData<ResponseRO>> => {
  const { entity, ...rest } = variables;
  return await getCrudMethods(entity.type).show(entity, rest);
};

export const useCrudShow = <ResponseRO extends BaseRO>(
  variables: CrudShowVariables,
  options?: CrudMutationOptions<CrudShowData<ResponseRO>, CrudShowVariables>
): CrudUseMutationResult<CrudShowData<ResponseRO>, CrudShowVariables> => {
  return useCrudMutation<CrudShowData<ResponseRO>, CrudShowVariables>(crudShow, options);
};

export const useCrudShowQuery = <ResponseRO extends BaseRO>(
  variables: CrudShowVariables,
  options?: CrudQueryOptions<CrudShowData<ResponseRO>, CrudShowVariables>
): CrudUseQueryResult<CrudShowData<ResponseRO>> => {
  const { entity, id } = variables;
  return useCrudQuery<CrudShowData<ResponseRO>, CrudShowVariables>(
    crudKeys.entityItem(entity, id),
    crudShow,
    variables,
    {
      ...options,
      enabled: (isNil(options?.enabled) || options?.enabled) && !!variables.id,
    }
  );
};
