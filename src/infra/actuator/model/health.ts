export type ActuatorHealthStatus = 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
export interface ActuatorHealthComponent<T> {
  status: ActuatorHealthStatus;
  description?: string;
  components?: { [key: string]: ActuatorHealthComponent<T> };
  details?: T;
}
export interface ActuatorHealthResponse {
  status: ActuatorHealthStatus;
  components: {
    [key: string]: ActuatorHealthComponent<never>;
  };
  groups: string[];
}

export interface ActuatorHealthComponentResponse<T> extends ActuatorHealthComponent<T> {
  groups?: string[];
}
