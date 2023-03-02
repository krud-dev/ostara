package dev.krud.boost.daemon.threadprofiling

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.crud.hooks.update.CRUDOnUpdateHook
import dev.krud.crudframework.modelfilter.dsl.where
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*

@Service
class ThreadProfilingService(
    private val crudHandler: CrudHandler,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {

    @Scheduled(fixedRate = 1000)
    fun runProfiling() {
        val runningThreadProfiling = crudHandler.index(
            where {
                ThreadProfilingRequest::status Equal ThreadProfilingStatus.RUNNING
            },
            ThreadProfilingRequest::class.java
        )
            .execute()
            .results

        val expired = runningThreadProfiling.filter { it.finishTime.time < System.currentTimeMillis() }
        expired.forEach {
            updateProfilingRequestToFinished(it.id)
        }

        val groupedByInstance = runningThreadProfiling.filter { !expired.any { request -> request == it } }.groupBy { it.instanceId }

        groupedByInstance.forEach { (instanceId, requests) ->
            val threadDumpRequest = actuatorClientProvider.provide(instanceId).threadDump()
            threadDumpRequest.onSuccess { threadDump ->
                requests.forEach { request ->
                    val threads = threadDump.threads.filter { thread -> thread.stackTrace.find { it.className == request.className } != null }
                    threads.forEach { thread ->
                        val threadLog = ThreadProfilingLog(request.id, thread)
                        crudHandler.create(threadLog).execute()
                    }
                }
            }
        }
    }

    fun getLogsForRequest(requestId: UUID): List<ThreadProfilingLog> {
        val request = getProfilingRequestByIdOrThrow(requestId)
        return crudHandler.index(
            where {
                ThreadProfilingLog::requestId Equal requestId
            },
            ThreadProfilingLog::class.java
        )
            .execute()
            .results
    }

    private fun getProfilingRequestByIdOrThrow(requestId: UUID): ThreadProfilingRequest {
        return crudHandler.show(requestId, ThreadProfilingRequest::class.java).execute() ?: throwNotFound("Thread Profiling Request $requestId not found")
    }

    private fun updateProfilingRequestToFinished(id: UUID) {
        crudHandler.updateByFilter(
            where {
                ThreadProfilingRequest::id Equal id
            },
            ThreadProfilingRequest::class.java
        )
            .withOnHook(
                CRUDOnUpdateHook {
                    it.status = ThreadProfilingStatus.FINISHED
                }
            )
            .execute()
    }
}