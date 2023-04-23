package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults
import java.io.Serializable
import java.lang.management.LockInfo

data class ThreadDumpActuatorResponse(
    val threads: List<Thread> = emptyList()
) : Serializable {
    data class Thread(
        val threadName: String = TypeDefaults.STRING,
        val threadId: Long = TypeDefaults.LONG,
        val blockedTime: Long = TypeDefaults.LONG,
        val blockedCount: Long = TypeDefaults.LONG,
        val waitedTime: Long = TypeDefaults.LONG,
        val waitedCount: Long = TypeDefaults.LONG,
        val lockName: String? = null,
        val lockOwnerId: Long = TypeDefaults.LONG,
        val lockOwnerName: String? = null,
        val daemon: Boolean = TypeDefaults.BOOLEAN,
        val inNative: Boolean = TypeDefaults.BOOLEAN,
        val suspended: Boolean = TypeDefaults.BOOLEAN,
        val threadState: String = TypeDefaults.STRING,
        val priority: Int = TypeDefaults.INT,
        val stackTrace: List<StackTraceFrame> = emptyList(),
        val lockedMonitors: List<LockedMonitor> = emptyList(),
        val lockedSynchronizers: List<LockedSynchronizer> = emptyList(),
        val lockInfo: LockInfo? = null
    ) : Serializable {
        data class StackTraceFrame(
            val classLoaderName: String? = null,
            val moduleName: String? = null,
            val moduleVersion: String? = null,
            val fileName: String? = null,
            val className: String? = null,
            val methodName: String? = null,
            val lineNumber: Int = TypeDefaults.INT,
            val nativeMethod: Boolean = TypeDefaults.BOOLEAN
        ) : Serializable

        data class LockedMonitor(
            val className: String? = null,
            val identityHashCode: Int = TypeDefaults.INT,
            val lockedStackDepth: Int = TypeDefaults.INT,
            val lockedStackFrame: StackTraceFrame = StackTraceFrame()
        ) : Serializable

        data class LockedSynchronizer(
            val className: String? = null,
            val identityHashCode: Int = TypeDefaults.INT
        ) : Serializable

        data class LockInfo(
            val className: String? = null,
            val identityHashCode: Int = TypeDefaults.INT
        ) : Serializable
    }
}