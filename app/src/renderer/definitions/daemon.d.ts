import { ApplicationRO, FolderRO, InstanceRO } from '../../common/generated_definitions';

export type ItemRO = InstanceRO | ApplicationRO | FolderRO;

export type ItemType = 'instance' | 'application' | 'folder';
