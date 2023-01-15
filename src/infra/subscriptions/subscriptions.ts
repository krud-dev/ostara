import { InstanceHealth } from '../configuration/model/configuration';
import { IpcRendererEvent } from 'electron';
import { InstanceAbility } from '../instance/models/ability';

export type Subscriptions = {
  'app:instanceHealthUpdated': (event: IpcRendererEvent, instanceId: string, health: InstanceHealth) => void;
  'app:applicationHealthUpdated': (event: IpcRendererEvent, applicationId: string, health: InstanceHealth) => void;
  'app:instanceEndpointsUpdated': (event: IpcRendererEvent, instanceId: string, endpoints: string[]) => void;
  'app:instanceAbilitiesUpdated': (event: IpcRendererEvent, instanceId: string, abilities: InstanceAbility[]) => void;
};
