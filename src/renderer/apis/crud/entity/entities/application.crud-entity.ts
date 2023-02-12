import { CrudEntity } from '../entity';

export const applicationCrudEntity: CrudEntity & { type: 'CrudFramework' } = {
  id: 'application',
  type: 'CrudFramework',
  path: 'applications',
};
