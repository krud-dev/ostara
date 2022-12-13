export interface ActuatorProperty {
  value: string;
  origin?: string;
}

export interface ActuatorPropertySource {
  name: string;
  properties?: { [key: string]: ActuatorProperty };
}

export interface ActuatorEnvResponse {
  activeProfiles: string[];
  propertySources: ActuatorPropertySource[];
}

export interface ActuatorEnvPropertyResponse {
  property: {
    source: string;
    value: string;
  };
  activeProfiles: string[];
  propertySources: ActuatorPropertySource[];
}
