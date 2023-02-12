import { CrudEntity } from '../entity';

export const folderCrudEntity: CrudEntity & { type: 'CrudFramework' } = {
  id: 'folder',
  type: 'CrudFramework',
  path: 'folders',
};
