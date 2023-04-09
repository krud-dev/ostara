import axios from 'axios';
import { Daemon, DaemonHealthResult } from './daemon';

export abstract class RestHealthCheckingDaemon implements Daemon {
  async doHealthCheck(): Promise<DaemonHealthResult> {
    try {
      const response = await axios.get(this.getDaemonAddress());
      if (response.status >= 200 && response.status < 300) {
        return { healthy: true };
      }

      return { healthy: false, message: `Received status code ${response.status}` };
    } catch (err) {
      if (err instanceof Error) {
        return { healthy: false, message: err.message };
      }

      return { healthy: false, message: `Unknown error: ${err}` };
    }
  }
  abstract getDaemonAddress(): string;

  abstract getDaemonWsAddress(): string;

  abstract start(): Promise<void>;

  abstract stop(): Promise<void>;
}
