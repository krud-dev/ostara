export type ActuatorThreadDumpStackTraceFrame = {
  classLoaderName?: string;
  moduleName: string;
  moduleVersion: string;
  fileName: string;
  className: string;
  methodName: string;
  lineNumber: number;
  nativeMethod: boolean;
};
export type ActuatorThreadDumpLockedMonitor = {
  className: string;
  identityHashCode: number;
  lockedStackDepth: number;
  lockedStackFrame: ActuatorThreadDumpStackTraceFrame;
};
export type ActuatorThreadDumpLockedSynchronizer = {
  className: string;
  identityHashCode: number;
};
export type ActuatorThreadDumpThread = {
  threadName: string;
  threadId: number;
  blockedTime: number;
  blockedCount: number;
  waitedTime: number;
  waitedCount: number;
  lockName: string;
  lockOwnerId: number;
  lockOwnerName?: string;
  daemon: boolean;
  inNative: boolean;
  suspended: boolean;
  threadState: string;
  priority: number;
  stackTrace: ActuatorThreadDumpStackTraceFrame[];
  lockedMonitors: ActuatorThreadDumpLockedMonitor[];
  lockedSynchronizers: ActuatorThreadDumpLockedSynchronizer[];
};

export type ActuatorThreadDumpResponse = {
  threads: ActuatorThreadDumpThread[];
};
