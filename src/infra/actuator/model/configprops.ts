export type ActuatorConfigPropsBean = {
  prefix: string;
  properties: { [key: string]: unknown };
  inputs: { [key: string]: unknown };
};

export type ActuatorConfigPropsContext = {
  beans: { [key: string]: ActuatorConfigPropsBean };
  parentId?: string;
};
export type ActuatorConfigPropsResponse = {
  contexts: { [key: string]: ActuatorConfigPropsContext };
};
