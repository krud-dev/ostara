export interface ActuatorGitInfo {
  branch: string;

  commit: {
    id: string;
    time: number;
  };
}

export interface ActuatorBuildInfo {
  artifact: string;
  name: string;
  time: number;
  version: string;
  group: string;
}

export interface ActuatorInfoResponse {
  git?: ActuatorGitInfo;
  build?: ActuatorBuildInfo;

  [key: string]: object | undefined;
}
