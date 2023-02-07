import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';
import { app, dialog } from 'electron';
import axios from 'axios';
import log from 'electron-log';
import { systemEvents } from '../infra/events';

type InternalDaemonOptions = {
  type: 'internal';
  protocol: 'http' | 'https';
  host: string;
  port: number | 'random';
};

type ExternalDaemonOptions = {
  type: 'external';
  address: string;
};

function isInternalOptions(options: InternalDaemonOptions | ExternalDaemonOptions): options is InternalDaemonOptions {
  return options.type === 'internal';
}

function isExternalDaemonOptions(
  options: InternalDaemonOptions | ExternalDaemonOptions
): options is ExternalDaemonOptions {
  return options.type === 'external';
}

export class DaemonController {
  private readonly options: InternalDaemonOptions | ExternalDaemonOptions;

  private readonly internalPort: number | undefined;

  private readonly daemonAddress: string;

  private started: boolean = false;

  private running: boolean = false;

  private healthCheckInterval: NodeJS.Timeout | undefined;

  private readonly defaultDaemonLocation = path.join(process.resourcesPath, 'daemon', 'daemon.jar');

  private readonly daemonDatabaseLocation = path.join(app.getPath('userData'), 'daemon.sqlite');

  private readonly defaultJdkLocation = path.join(process.resourcesPath, 'jdk', 'bin', 'java');

  private daemonProcess?: ChildProcessWithoutNullStreams = undefined;

  constructor(options: InternalDaemonOptions | ExternalDaemonOptions) {
    this.options = options;
    if (isInternalOptions(options)) {
      let { port } = options;
      if (port === 'random') {
        port = Math.floor(Math.random() * 10000) + 10000; // todo: check if port is available
      }
      this.daemonAddress = `${options.protocol}://${options.host}:${port}`;
      this.internalPort = port;
    } else {
      this.daemonAddress = options.address;
    }
  }

  async start() {
    return new Promise<void>((resolve) => {
      if (isInternalOptions(this.options)) {
        log.info(`Starting daemon on ${this.daemonAddress}...`);
        this.initDaemonProcess();
      } else {
        log.info(`Using external daemon on ${this.daemonAddress}...`);
      }

      this.startHealthCheck();
    });
  }

  async stop() {
    this.stopHealthCheck();
    if (this.daemonProcess) {
      log.info('Stopping daemon...');
      this.daemonProcess.kill();
      this.daemonProcess = undefined;
    }
  }

  private startHealthCheck() {
    if (this.healthCheckInterval) {
      throw new Error('Health check is already running');
    }
    log.info('Starting health check...');
    this.healthCheckInterval = setInterval(async () => {
      try {
        const response = await axios.get(this.daemonAddress);
        if (response.status === 200) {
          if (!this.started) {
            log.info('Daemon is ready!');
            systemEvents.emit('daemon-ready');
          }
          if (!this.running && this.started) {
            log.info('Daemon is healthy!');
            systemEvents.emit('daemon-healthy');
          }
          this.running = true;
          this.started = true;
        } else {
          throw new Error('Daemon is not running!');
        }
      } catch (err) {
        if (this.running && this.started) {
          log.info('Daemon is unhealthy!');
          systemEvents.emit('daemon-unhealthy');
        }
        this.running = false;
      }
    }, 1000);
  }

  private stopHealthCheck() {
    if (!this.healthCheckInterval) {
      throw new Error('Health check is not running');
    }
    log.info('Stopping health check...');
    clearInterval(this.healthCheckInterval);
    this.healthCheckInterval = undefined;
  }

  private initDaemonProcess() {
    if (this.daemonProcess) {
      throw new Error('Daemon is already running');
    }
    if (!isInternalOptions(this.options)) {
      throw new Error('Cannot start internal daemon process with external options');
    }

    const env = { IP: this.options.host, SERVER_PORT: String(this.internalPort), SPRING_DATASOURCE_URL: `jdbc:sqlite:${this.daemonDatabaseLocation}` };

    if (!app.isPackaged) {
      log.info('Running daemon from source...');
      this.daemonProcess = spawn('./gradlew', ['bootRun'], {
        cwd: path.join(__dirname, '..', '..', 'daemon'),
        env: { ...process.env, ...env },
      });
    } else {
      log.info('Running daemon from jar...');
      this.daemonProcess = spawn(this.defaultJdkLocation, ['-jar', this.defaultDaemonLocation], {
        env: { ...process.env, ...env },
      });
    }

    process.on('exit', () => {
      if (this.daemonProcess) {
        this.daemonProcess.kill();
      }
    });

    this.daemonProcess.on('error', (err) => {
      log.error(`Failed to start daemon: ${err}`);
      app.exit();
    });

    this.daemonProcess.on('close', (code) => {
      log.error(`Daemon exited with code ${code}`);
      app.exit();
    });

    this.daemonProcess.stdout.on('data', (data) => {
      log.info(`daemon: ${data}`);
    });

    this.daemonProcess.stderr.on('data', (data) => {
      log.error(`daemon: ${data}`);
    });
  }
}
