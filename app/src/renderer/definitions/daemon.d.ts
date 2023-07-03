import { AgentRO, ApplicationRO, FolderRO, InstanceRO } from 'common/generated_definitions';

export type ItemRO = InstanceRO | ApplicationRO | FolderRO | AgentRO;

export type ItemType = 'instance' | 'application' | 'folder' | 'agent';
