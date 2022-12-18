export type ActuatorProperty = {
  value: string;
  origin?: string;
};

export type ActuatorPropertySource = {
  name: string;
  properties?: { [key: string]: ActuatorProperty };
};

export type ActuatorEnvResponse = {
  activeProfiles: string[];
  propertySources: ActuatorPropertySource[];
};

export type ActuatorEnvPropertyResponse = {
  property: {
    source: string;
    value: string;
  };
  activeProfiles: string[];
  propertySources: ActuatorPropertySource[];
};
