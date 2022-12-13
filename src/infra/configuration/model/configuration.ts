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
  description?: string;
  icon?: string;
  order?: number;
  instances: Instance[];
}

export interface Folder {
  uuid: string;
  alias: string;
  order?: number;
  icon?: string;
  items: { [key: string]: Folder | Application };
}

export interface Configuration {
  items: { [key: string]: Folder | Application };
}
