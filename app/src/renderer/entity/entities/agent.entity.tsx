import { Entity } from 'renderer/entity/entity';
import { AgentRO } from 'common/generated_definitions';
import { ADD_ID, DELETE_ID, UPDATE_ID } from '../actions';

export const agentEntity: Entity<AgentRO> = {
  id: 'agent',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'url',
      type: 'Text',
      labelId: 'url',
    },
    {
      id: 'apiKey',
      type: 'Text',
      labelId: 'apiKey',
    },
  ],
  actions: [
    {
      id: UPDATE_ID,
      labelId: 'update',
      icon: 'EditOutlined',
    },
    {
      id: DELETE_ID,
      labelId: 'delete',
      icon: 'DeleteOutlined',
    },
  ],
  massActions: [],
  globalActions: [
    {
      id: ADD_ID,
      labelId: 'createAgent',
      icon: 'AddOutlined',
    },
  ],
  defaultOrder: [
    {
      id: 'name',
      direction: 'asc',
    },
  ],
  paging: true,
  getId: (item) => item.id,
  filterData: (data, filter) =>
    data.filter(
      (item) =>
        item.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item.url?.toLowerCase().includes(filter.toLowerCase()) ||
        item.apiKey?.toLowerCase().includes(filter.toLowerCase())
    ),
};
