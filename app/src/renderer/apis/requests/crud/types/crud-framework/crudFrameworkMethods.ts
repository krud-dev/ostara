import { CrudMethods } from '../crud';
import { crudFrameworkUpdate } from './crudFrameworkUpdate';
import { crudFrameworkShow } from './crudFrameworkShow';
import { crudFrameworkSearchCount } from './crudFrameworkSearchCount';
import { crudFrameworkSearch } from './crudFrameworkSearch';
import { crudFrameworkDelete } from './crudFrameworkDelete';
import { crudFrameworkCreate } from './crudFrameworkCreate';
import { crudFrameworkCreateBulk } from './crudFrameworkCreateBulk';

export const crudFrameworkMethods: CrudMethods<'CrudFramework'> = {
  create: crudFrameworkCreate,
  createBulk: crudFrameworkCreateBulk,
  delete: crudFrameworkDelete,
  search: crudFrameworkSearch,
  searchCount: crudFrameworkSearchCount,
  show: crudFrameworkShow,
  update: crudFrameworkUpdate,
};
