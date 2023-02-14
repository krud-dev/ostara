export type Events = {
  /**
   * System
   */
  'daemon-ready': () => void;
  'daemon-healthy': () => void;
  'daemon-unhealthy': () => void;
};
