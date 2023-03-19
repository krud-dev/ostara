import { CrudUpdateData, CrudUpdateVariables } from '../crudUpdate';
import { crudFrameworkMethods } from './crud-framework/crudFrameworkMethods';
import { CrudShowData, CrudShowVariables } from '../crudShow';
import { CrudSearchCountData, CrudSearchCountVariables } from '../crudSearchCount';
import { CrudSearchData, CrudSearchVariables } from '../crudSearch';
import { CrudDeleteData, CrudDeleteVariables } from '../crudDelete';
import { CrudCreateData, CrudCreateVariables } from '../crudCreate';
import { BaseRO, CrudEntity, CrudEntityType } from '../entity/entity';
import { CrudCreateBulkData, CrudCreateBulkVariables } from '../crudCreateBulk';

export type CrudMethods<T extends CrudEntityType> = {
  create: <ResponseRO, RequestRO = ResponseRO>(
    entity: CrudEntity & { type: T },
    variables: Omit<CrudCreateVariables<RequestRO>, 'entity'>
  ) => Promise<CrudCreateData<ResponseRO>>;
  createBulk: <ResponseRO, RequestRO = ResponseRO>(
    entity: CrudEntity & { type: T },
    variables: Omit<CrudCreateBulkVariables<RequestRO>, 'entity'>
  ) => Promise<CrudCreateBulkData<ResponseRO>>;
  delete: (entity: CrudEntity & { type: T }, variables: Omit<CrudDeleteVariables, 'entity'>) => Promise<CrudDeleteData>;
  search: <ResponseRO extends BaseRO>(
    entity: CrudEntity & { type: T },
    variables: Omit<CrudSearchVariables, 'entity'>
  ) => Promise<CrudSearchData<ResponseRO>>;
  searchCount: (
    entity: CrudEntity & { type: T },
    variables: Omit<CrudSearchCountVariables, 'entity'>
  ) => Promise<CrudSearchCountData>;
  show: <ResponseRO extends BaseRO>(
    entity: CrudEntity & { type: T },
    variables: Omit<CrudShowVariables, 'entity'>
  ) => Promise<CrudShowData<ResponseRO>>;
  update: <ResponseRO extends BaseRO, RequestRO = ResponseRO>(
    entity: CrudEntity & { type: T },
    variables: Omit<CrudUpdateVariables<RequestRO>, 'entity'>
  ) => Promise<CrudUpdateData<ResponseRO>>;
};

const crudMethodsMap: Map<CrudEntityType, CrudMethods<any>> = new Map<CrudEntityType, CrudMethods<any>>([
  ['CrudFramework', crudFrameworkMethods],
]);

export const getCrudMethods = <T extends CrudEntityType>(type: T): CrudMethods<T> => {
  const crudMethods = crudMethodsMap.get(type);
  if (!crudMethods) {
    throw new Error(`CrudMethods for type ${type} not found`);
  }
  return crudMethods;
};
