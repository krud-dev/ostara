export type ActuatorBean = {
  aliases: string[];
  scope: string;
  type: string;
  dependencies: string[];
};

export type ActuatorBeansResponse = {
  contexts: {
    [key: string]: {
      beans: { [key: string]: ActuatorBean };
    };
  };
};
