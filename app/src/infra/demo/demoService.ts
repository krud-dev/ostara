import { app } from 'electron';
import { PackagedDemoManager } from './manager/packagedDemoManager';
import { StubDemoManager } from './manager/stubDemoManager';

class DemoService {
  private demoStarted: boolean = false;

  private demoManager = app.isPackaged ? new PackagedDemoManager() : new StubDemoManager();

  isStarted(): boolean {
    return this.demoStarted;
  }

  async startDemo(): Promise<string> {
    if (this.demoStarted) {
      return this.demoManager.getAddress();
    }
    await this.demoManager.start();
    this.demoStarted = true;
    return this.demoManager.getAddress();
  }

  async stopDemo(): Promise<void> {
    if (!this.demoStarted) {
      return;
    }
    await this.demoManager.stop();
    this.demoStarted = false;
  }

  getAddress(): string {
    return this.demoManager.getAddress();
  }
}

export const demoService = new DemoService();
