export interface DemoManager {
  doHealthCheck(): Promise<boolean>;
  start(): Promise<void>;

  stop(): Promise<void>;

  getAddress(): string;
}
