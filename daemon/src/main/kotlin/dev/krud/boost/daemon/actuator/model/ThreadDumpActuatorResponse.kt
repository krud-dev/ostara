package dev.krud.boost.daemon.actuator.model

data class ThreadDumpActuatorResponse(
    val threads: List<Thread>
)  {
    data class Thread(
        val threadName: String,
        val threadId: Long,
        val blockedTime: Long,
        val blockedCount: Long,
        val waitedTime: Long,
        val waitedCount: Long,
        val lockName: String,
        val lockOwnerId: Long,
        val lockOwnerName: String?,
        val daemon: Boolean,
        val inNative: Boolean,
        val suspended: Boolean,
        val threadState: String,
        val priority: Int,
        val stackTrace: List<StackTraceFrame>,
        val lockedMonitors: List<LockedMonitor>,
        val lockedSynchronizers: List<LockedSynchronizer>
    ) {
        data class StackTraceFrame(
            val classLoaderName: String?,
            val moduleName: String,
            val moduleVersion: String,
            val fileName: String,
            val className: String,
            val methodName: String,
            val lineNumber: Int,
            val nativeMethod: Boolean
        )

        data class LockedMonitor(
            val className: String,
            val identityHashCode: Int,
            val lockedStackDepth: Int,
            val lockedStackFrame: StackTraceFrame
        )

        data class LockedSynchronizer(
            val className: String,
            val identityHashCode: Int
        )
    }
}