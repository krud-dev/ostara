import { ActuatorLogLevel } from '../../actuator/model/loggers';

export type InstanceLogger = {
  name: string;
  effectiveLevel: ActuatorLogLevel;
  configuredLevel?: ActuatorLogLevel;
};

export type ApplicationLogger = {
  name: string;
  instanceLoggers: {
    [instanceId: string]: Omit<InstanceLogger, 'name'>;
  };
};
