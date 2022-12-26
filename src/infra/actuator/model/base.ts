export type ActuatorMainResponse = {
  _links: {
    [key: string]: {
      href: string;
      templated: boolean;
    };
  };
};

export type ActuatorTestConnectionResponse = {
  statusCode: number;
  statusText?: string;
  success: boolean;
};
