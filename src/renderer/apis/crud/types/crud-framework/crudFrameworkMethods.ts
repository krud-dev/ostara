import { CrudMethods } from '../crud';
import { crudFrameworkUpdate } from './crudFrameworkUpdate';
import { crudFrameworkShow } from './crudFrameworkShow';
import { crudFrameworkSearchCount } from './crudFrameworkSearchCount';
import { crudFrameworkSearch } from './crudFrameworkSearch';
import { crudFrameworkDelete } from './crudFrameworkDelete';
import { crudFrameworkCreate } from './crudFrameworkCreate';

export const crudFrameworkMethods: CrudMethods<'CrudFramework'> = {
  create: crudFrameworkCreate,
  delete: crudFrameworkDelete,
  search: crudFrameworkSearch,
  searchCount: crudFrameworkSearchCount,
  show: crudFrameworkShow,
  update: crudFrameworkUpdate,
};
