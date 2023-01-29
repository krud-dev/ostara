export type ActuatorLiquibaseChangeset = {
  id: string;
  checksum: string;
  orderExecuted: number;
  author: string;
  changeLog: string;
  comments: string;
  contexts: string[];
  dateExecuted: string;
  deploymentId: string;
  description: string;
  execType: string;
  labels: string[];
  tag?: string;
};

export type ActuatorLiquibaseBean = {
  changeSets: ActuatorLiquibaseChangeset[];
};
export type ActuatorLiquibaseContext = {
  liquibaseBeans: { [key: string]: ActuatorLiquibaseBean };
};
export type ActuatorLiquibaseResponse = {
  contexts: { [key: string]: ActuatorLiquibaseContext };
};
