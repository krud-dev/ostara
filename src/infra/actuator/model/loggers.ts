export type ActuatorLogLevel = 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';
export type ActuatorLogger = {
  configuredLevel?: ActuatorLogLevel;
  effectiveLevel: ActuatorLogLevel;
};

export type ActuatorLoggerGroup = {
  configuredLevel?: ActuatorLogLevel;
  members: string[];
};

export type ActuatorLoggersResponse = {
  levels: ActuatorLogLevel[];
  loggers: {
    [key: string]: ActuatorLogger;
  };
  groups: {
    [key: string]: ActuatorLoggerGroup;
  };
};

export type ActuatorLoggerResponse = ActuatorLogger | ActuatorLoggerGroup;

export function isActuatorLoggerGroup(logger: ActuatorLoggerResponse): logger is ActuatorLoggerGroup {
  return 'members' in logger;
}
