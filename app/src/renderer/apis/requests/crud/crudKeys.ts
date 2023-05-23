import { CrudEntity } from './entity/entity';

export const crudKeys = {
  entity: (entity: CrudEntity) => ['crud', entity.id],
  entityItems: (entity: CrudEntity, vars: any) => [...crudKeys.entity(entity), 'items', vars],
  entityItemsCount: (entity: CrudEntity, vars: any) => [...crudKeys.entityItems(entity, vars), 'count'],
  entityItem: (entity: CrudEntity, id: string) => [...crudKeys.entity(entity), 'item', id],
};
