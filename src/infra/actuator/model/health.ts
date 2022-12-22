export type ActuatorHealthStatus = 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
export type ActuatorHealthComponent = {
  status: ActuatorHealthStatus;
  description?: string;
  components?: { [key: string]: ActuatorHealthComponent };
  details?: { [key: string]: unknown };
};
export type ActuatorHealthResponse = {
  status: ActuatorHealthStatus;
  components: {
    [key: string]: ActuatorHealthComponent;
  };
  groups: string[];
};

export type ActuatorHealthComponentResponse<T> = ActuatorHealthComponent & {
  groups?: string[];
};
