import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import { systemEvents } from '../events';
import { Daemon } from './core/daemon';
import { PackagedDaemon } from './packaged/packagedDaemon';
import { RemoteDaemon } from './remote/remoteDaemon';

export class DaemonController {
  private started: boolean = false;

  private running: boolean = false;

  private healthCheckInterval: NodeJS.Timeout | undefined;

  constructor(private readonly daemon: Daemon) {}

  initializeSubscriptions(window: BrowserWindow) {
    systemEvents.on('daemon-healthy', () => {
      window.webContents.send('app:daemonHealthy');
    });

    systemEvents.on('daemon-unhealthy', () => {
      window.webContents.send('app:daemonUnhealthy');
    });
  }

  getDaemonAddress(): string {
    return this.daemon.getDaemonAddress();
  }

  getDaemonWsAddress(): string {
    return this.daemon.getDaemonWsAddress();
  }

  async start() {
    log.info('Starting daemon...');
    await this.daemon.start();
    this.startHealthCheck();
  }

  async stop() {
    log.info('Stopping daemon...');
    this.stopHealthCheck();
    await this.daemon.stop();
    this.started = false;
    this.running = false;
  }

  async restart() {
    await this.stop();
    await this.start();
  }

  isHealthy(): boolean {
    return this.started && this.running;
  }

  private startHealthCheck() {
    if (this.healthCheckInterval) {
      return;
    }
    log.info('Starting health check interval');
    this.healthCheckInterval = setInterval(async () => {
      log.silly('Running daemon health check...');
      const { healthy, message } = await this.daemon.doHealthCheck();
      log.silly(`Daemon health check result: ${healthy} - ${message}`);
      if (healthy) {
        if (!this.started) {
          log.info('Daemon is ready!');
          systemEvents.emit('daemon-ready');
        } else if (!this.running && this.started) {
          log.info('Daemon is healthy!');
          systemEvents.emit('daemon-healthy');
        }
        this.running = true;
        this.started = true;
      } else {
        if (this.running && this.started) {
          log.info('Daemon is unhealthy!');
          systemEvents.emit('daemon-unhealthy');
        }
        this.running = false;
      }
    }, 1000);
  }

  private stopHealthCheck() {
    if (this.healthCheckInterval) {
      log.info('Stopping health check...');
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }
}

let daemonController: DaemonController | undefined;

export function getDaemonController(): DaemonController | undefined {
  return daemonController;
}

export async function initDaemonController(): Promise<DaemonController> {
  if (daemonController) {
    return daemonController;
  }
  if (app.isPackaged) {
    daemonController = new DaemonController(new PackagedDaemon());
  } else {
    daemonController = new DaemonController(
      new RemoteDaemon({
        host: '127.0.0.1',
        port: 12222,
        protocol: 'http',
      })
    );
  }
  daemonController.start().catch((e) => {
    log.error('Error starting daemon', e);
    app.exit(1);
  });
  return daemonController;
}
