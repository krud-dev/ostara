import { CrudUpdateData } from '../../crudUpdate';
import { BaseRO, CrudEntity, CrudEntityTypeHelper } from '../../entity/entity';

export const localStorageUpdate = async <ResponseRO extends BaseRO, RequestRO extends BaseRO = ResponseRO>(
  entity: CrudEntity & CrudEntityTypeHelper<'LocalStorage'>,
  item: RequestRO
): Promise<CrudUpdateData<ResponseRO>> => {
  return item as any;
};
