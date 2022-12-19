import { Item } from 'infra/configuration/model/configuration';

export type TreeItem = Item & { children?: TreeItem[] };
