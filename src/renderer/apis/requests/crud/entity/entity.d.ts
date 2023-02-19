export type CrudEntityType = 'CrudFramework' | 'LocalStorage';

export type CrudEntityBase = {
  id: string;
};

type CrudEntityCrudFramework = CrudEntityBase & {
  type: 'CrudFramework';
  path: string;
};

type CrudEntityLocalStorage = CrudEntityBase & {
  type: 'LocalStorage';
};

export type CrudEntity = CrudEntityCrudFramework | CrudEntityLocalStorage;

export type BaseRO = {
  id: string;
};
