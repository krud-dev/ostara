import { CrudUpdateData } from '../../crudUpdate';
import { BaseRO, CrudEntityLocalStorage } from '../../entity/entity';

export const localStorageUpdate = async <ResponseRO extends BaseRO, RequestRO extends BaseRO = ResponseRO>(
  entity: CrudEntityLocalStorage,
  item: RequestRO
): Promise<CrudUpdateData<ResponseRO>> => {
  return item as any;
};
