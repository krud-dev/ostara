import { DemoManager } from './demoManager';

export class StubDemoManager implements DemoManager {
  doHealthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getAddress(): string {
    return 'http://localhost:13333/actuator';
  }

  start(): Promise<void> {
    return Promise.resolve();
  }

  stop(): Promise<void> {
    return Promise.resolve();
  }
}
