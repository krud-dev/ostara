export type ActuatorLogLevel =
  | 'OFF'
  | 'ERROR'
  | 'WARN'
  | 'INFO'
  | 'DEBUG'
  | 'TRACE'
  | 'ALL';
export interface ActuatorLogger {
  configuredLevel?: ActuatorLogLevel;
  effectiveLevel: ActuatorLogLevel;
}

export interface ActuatorLoggerGroup {
  configuredLevel?: ActuatorLogLevel;
  members: string[];
}

export interface ActuatorLoggersResponse {
  levels: ActuatorLogLevel[];
  loggers: {
    [key: string]: ActuatorLogger;
  };
  groups: {
    [key: string]: ActuatorLoggerGroup;
  };
}

export type ActuatorLoggerResponse = ActuatorLogger | ActuatorLoggerGroup;
