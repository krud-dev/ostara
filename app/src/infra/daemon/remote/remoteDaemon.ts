import log from 'electron-log';
import { RestHealthCheckingDaemon } from '../core/restHealthCheckingDaemon';

export type RemoteDaemonOptions = {
  protocol: 'http' | 'https';
  host: string;
  port: number;
};

export class RemoteDaemon extends RestHealthCheckingDaemon {
  private readonly address: string;

  private readonly wsAddress: string;

  constructor(private readonly options: RemoteDaemonOptions) {
    super();
    this.address = `${options.protocol}://${options.host}:${options.port}`;
    this.wsAddress = `${options.protocol === 'http' ? 'ws' : 'wss'}://${options.host}:${options.port}/ws`;
  }

  getDaemonAddress(): string {
    return this.address;
  }

  getDaemonWsAddress(): string {
    return this.wsAddress;
  }

  async start(): Promise<void> {
    log.warn('Daemon is remote, cannot start it');
  }

  async stop(): Promise<void> {
    log.warn('Daemon is remote, cannot stop it');
  }
}
