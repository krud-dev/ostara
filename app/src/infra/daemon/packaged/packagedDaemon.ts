import { RestHealthCheckingDaemon } from '../core/restHealthCheckingDaemon';
import path from 'path';
import { app } from 'electron';
import { isWindows } from '../../utils/platform';
import { configurationStore } from '../../store/store';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import log from 'electron-log';
import fs from 'fs-extra';

export class PackagedDaemon extends RestHealthCheckingDaemon {
  private readonly address: string;

  private readonly wsAddress: string;

  private readonly host: string = 'localhost';

  private readonly port: number;

  private readonly defaultDaemonLocation = path.join(process.resourcesPath, 'daemon', 'daemon.jar');

  private readonly daemonDatabaseLocation = path.join(app.getPath('userData'), 'daemon.sqlite');

  private readonly defaultJdkLocation = path.join(process.resourcesPath, 'jdk', 'bin', isWindows ? 'java.exe' : 'java');

  private readonly sentryEnabled = configurationStore.get('errorReportingEnabled');

  private childProcess?: ChildProcessWithoutNullStreams = undefined;

  constructor() {
    super();
    this.port = Math.floor(Math.random() * 10000) + 10000; // todo: check if port is available
    this.address = `http://${this.host}:${this.port}`;
    this.wsAddress = `ws://${this.host}:${this.port}/ws`;
  }

  getDaemonAddress(): string {
    return this.address;
  }

  getDaemonWsAddress(): string {
    return this.wsAddress;
  }

  async start(): Promise<void> {
    if (this.childProcess) {
      log.warn('Packaged Daemon is already started');
      return;
    }

    const heapdumpDirectory = path.join(app.getPath('userData'), 'heapdumps');
    const backupDirectory = path.join(app.getPath('userData'), 'backups');
    fs.ensureDirSync(heapdumpDirectory);
    fs.ensureDirSync(backupDirectory);

    const env = {
      SERVER_ADDRESS: this.host,
      SERVER_PORT: String(this.port),
      SPRING_DATASOURCE_URL: `jdbc:sqlite:${this.daemonDatabaseLocation}`,
      SPRING_PROFILES_ACTIVE: this.sentryEnabled ? 'sentry' : '',
      APP_MAIN_HEAPDUMP_DIRECTORY: heapdumpDirectory,
      APP_MAIN_BACKUP_DIRECTORY: backupDirectory,
    };

    if (!app.isPackaged) {
      log.info('Running daemon from source...');
      this.childProcess = spawn(isWindows ? './gradlew' : './gradlew.bat', ['bootRun'], {
        cwd: path.join(__dirname, '..', '..', 'daemon'),
        env: { ...process.env, ...env },
      });
    } else {
      log.info('Running daemon from jar...');
      this.childProcess = spawn(this.defaultJdkLocation, ['-jar', this.defaultDaemonLocation], {
        env: { ...process.env, ...env },
      });
    }
    this.initProcessEvents();
  }

  async stop(): Promise<void> {
    if (this.childProcess) {
      log.info('Stopping daemon process...');
      this.childProcess.kill();
      this.childProcess = undefined;
    }
  }

  private initProcessEvents() {
    if (!this.childProcess) {
      return;
    }

    this.childProcess.stdout.on('data', (data) => {
      log.info(`daemon: ${data}`);
    });

    this.childProcess.stderr.on('data', (data) => {
      log.error(`daemon: ${data}`);
    });

    process.on('exit', () => {
      this.childProcess?.kill();
    });
  }
}
