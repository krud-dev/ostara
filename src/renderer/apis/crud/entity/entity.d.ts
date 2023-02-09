export type CrudEntityType = 'CrudFramework' | 'LocalStorage';

type CrudEntityTypeCrudFramework = {
  type: 'CrudFramework';
  path: string;
};

type CrudEntityTypeLocalStorage = {
  type: 'LocalStorage';
};

type CrudEntityTypes = CrudEntityTypeCrudFramework | CrudEntityTypeLocalStorage;

export type CrudEntityTypeHelper<T> = T extends 'CrudFramework'
  ? CrudEntityTypeCrudFramework
  : T extends 'LocalStorage'
  ? CrudEntityTypeLocalStorage
  : never;

export type CrudEntity = CrudEntityTypes & {
  id: string;
};

export type BaseRO = {
  id: string;
};
