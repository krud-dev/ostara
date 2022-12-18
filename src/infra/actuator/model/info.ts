export type ActuatorGitInfo = {
  branch: string;

  commit: {
    id: string;
    time: number;
  };
};

export type ActuatorBuildInfo = {
  artifact: string;
  name: string;
  time: number;
  version: string;
  group: string;
};

export type ActuatorInfoResponse = {
  git?: ActuatorGitInfo;
  build?: ActuatorBuildInfo;

  [key: string]: object | undefined;
};
