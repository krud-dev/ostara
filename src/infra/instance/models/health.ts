import { InstanceHealthStatus } from '../../configuration/model/configuration';

export type InstanceHealth = {
  status: InstanceHealthStatus;
  lastUpdateTime: number;
};
