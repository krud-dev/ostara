export type ActuatorFlywayMigration = {
  type: string;
  checksum: number;
  version: string;
  description: string;
  script: string;
  state: string;
  installedBy: string;
  installedOn: string;
  installedRank: number;
  executionTime: number;
};

export type ActuatorFlywayBean = {
  migrations: ActuatorFlywayMigration[];
};
export type ActuatorFlywayContext = {
  flywayBeans: { [key: string]: ActuatorFlywayBean };
};
export type ActuatorFlywayResponse = {
  contexts: { [key: string]: ActuatorFlywayContext };
};
