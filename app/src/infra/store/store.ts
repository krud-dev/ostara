import ElectronStore from 'electron-store';

export const defaults = {
  /**
   * Whether Sentry error reporting is enabled or not.
   */
  errorReportingEnabled: true,
  /**
   * Whether auto-updates are enabled or not.
   */
  autoUpdateEnabled: true,

  lastUpdateCheckTime: 0,
};

export type Configuration = typeof defaults;

export const configurationStore = new ElectronStore<Configuration>({
  name: 'boost_configuration',
  defaults,
});
