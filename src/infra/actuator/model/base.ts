export type ActuatorMainResponse = {
  _links: ActuatorEndpointsResponse;
};

export type ActuatorEndpoint = {
  href: string;
  templated: boolean;
};

export type ActuatorEndpointsResponse = {
  [key: string]: ActuatorEndpoint;
};

export type ActuatorTestConnectionResponse = {
  statusCode: number;
  statusText?: string;
  validActuator: boolean;
  success: boolean;
};
