export type ActuatorHealthStatus = 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
export type ActuatorHealthComponent<T> = {
  status: ActuatorHealthStatus;
  description?: string;
  components?: { [key: string]: ActuatorHealthComponent<T> };
  details?: T;
};
export type ActuatorHealthResponse = {
  status: ActuatorHealthStatus;
  components: {
    [key: string]: ActuatorHealthComponent<never>;
  };
  groups: string[];
};

export type ActuatorHealthComponentResponse<T> = ActuatorHealthComponent<T> & {
  groups?: string[];
};
