import { Application, Instance } from '../configuration/model/configuration';

export type Events = {
  /**
   * instance events
   * @param
   */
  'instance-created': (instance: Instance) => void;
  'instance-updated': (instance: Instance) => void;
  'instance-deleted': (instance: Instance) => void;
  'instance-moved': (instance: Instance, oldParentApplicationId: string, newParentApplicationId: string) => void;
  /**
   * Application events
   * @param application
   */
  'application-created': (application: Application) => void;
  'application-updated': (application: Application) => void;
  'application-deleted': (application: Application) => void;
  'application-moved': (
    application: Application,
    oldParentFolderId: string | undefined,
    newParentFolderId: string | undefined
  ) => void;

  /**
   * Heapdump Reference events
   */

  'heapdump-reference-downloading': (referenceId: string) => void;

  'heapdump-reference-download-complete': (referenceId: string) => void;

  'heapdump-reference-download-failed': (referenceId: string, message: string) => void;
};
