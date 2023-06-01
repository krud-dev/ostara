import { Entity } from 'renderer/entity/entity';
import { ADD_ID, DELETE_ID, UPDATE_ID } from 'renderer/entity/actions';
import { ApplicationMetricRuleRO } from '../../../common/generated_definitions';
import { getMetricRuleFormValues, getMetricRuleFormValuesFormula } from '../../utils/metricUtils';

export const applicationMetricRuleEntity: Entity<ApplicationMetricRuleRO> = {
  id: 'applicationMetricRule',
  columns: [
    {
      id: 'name',
      type: 'Text',
      labelId: 'name',
    },
    {
      id: 'formula',
      type: 'CustomText',
      labelId: 'formula',
      getText: (item) => getMetricRuleFormValuesFormula(getMetricRuleFormValues(item)),
      width: 300,
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
      labelId: 'addMetricNotification',
      icon: 'NotificationAddOutlined',
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
        getMetricRuleFormValuesFormula(getMetricRuleFormValues(item)).includes(filter.toLowerCase())
    ),
};
