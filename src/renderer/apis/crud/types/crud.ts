import { CrudUpdateData, CrudUpdateVariables } from '../crudUpdate';
import { crudFrameworkMethods } from './crud-framework/crudFrameworkMethods';
import { CrudShowData, CrudShowVariables } from '../crudShow';
import { CrudSearchCountData, CrudSearchCountVariables } from '../crudSearchCount';
import { CrudSearchData, CrudSearchVariables } from '../crudSearch';
import { CrudDeleteData, CrudDeleteVariables } from '../crudDelete';
import { CrudCreateData, CrudCreateVariables } from '../crudCreate';
import { BaseRO, CrudEntity, CrudEntityType, CrudEntityTypeHelper } from '../entity/entity';

export type CrudMethods<T extends CrudEntityType> = {
  create: <ResponseRO, RequestRO = ResponseRO>(
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudCreateVariables<RequestRO>, 'entity'>
  ) => Promise<CrudCreateData<ResponseRO>>;
  delete: (
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudDeleteVariables, 'entity'>
  ) => Promise<CrudDeleteData>;
  search: <ResponseRO extends BaseRO>(
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudSearchVariables, 'entity'>
  ) => Promise<CrudSearchData<ResponseRO>>;
  searchCount: (
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudSearchCountVariables, 'entity'>
  ) => Promise<CrudSearchCountData>;
  show: <ResponseRO extends BaseRO>(
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudShowVariables, 'entity'>
  ) => Promise<CrudShowData<ResponseRO>>;
  update: <ResponseRO extends BaseRO, RequestRO = ResponseRO>(
    entity: CrudEntity & CrudEntityTypeHelper<T>,
    variables: Omit<CrudUpdateVariables<RequestRO>, 'entity'>
  ) => Promise<CrudUpdateData<ResponseRO>>;
};

const crudMethodsMap: Map<CrudEntityType, CrudMethods<CrudEntityType>> = new Map<
  CrudEntityType,
  CrudMethods<CrudEntityType>
>([['CrudFramework', crudFrameworkMethods]]);

export const getCrudMethods = <T extends CrudEntityType>(type: T): CrudMethods<T> => {
  const crudMethods = crudMethodsMap.get(type);
  if (!crudMethods) {
    throw new Error(`CrudMethods for type ${type} not found`);
  }
  return crudMethods;
};
