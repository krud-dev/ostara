import { CrudEntity } from '../entity';

export const instanceCrudEntity: CrudEntity & { type: 'CrudFramework' } = {
  id: 'instance',
  type: 'CrudFramework',
  path: 'instances',
};
