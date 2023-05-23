export type DaemonHealthResult = {
  healthy: boolean;
  message?: string;
};

export interface Daemon {
  doHealthCheck(): Promise<DaemonHealthResult>;

  start(): Promise<void>;

  stop(): Promise<void>;

  getDaemonAddress(): string;

  getDaemonWsAddress(): string;
}
