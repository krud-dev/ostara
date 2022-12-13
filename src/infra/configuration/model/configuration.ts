export type ApplicationType = 'SpringBoot';

export interface Instance {
  uuid: string;
  alias: string;
  order: number;
  actuatorUrl: string;
}

export interface Application {
  uuid: string;
  type: ApplicationType;
  alias: string;
  description: string;
  icon: string;
  instances: Instance[];
}

export interface Folder {
  uuid: string;
  alias: string;
  order: number;
  icon: string;
  folders: { [key: string]: Folder };
  applications: { [key: string]: Application };
}

export interface Configuration {
  folders: { [key: string]: Folder };
}
