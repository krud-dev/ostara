package dev.krud.boost.daemon.threadprofiling

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.modelfilter.dsl.where
import dev.krud.crudframework.ro.PagedResult
import io.github.oshai.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*

@Service
class ThreadProfilingService(
    private val instanceService: InstanceService,
    private val threadProfilingRequestKrud: Krud<ThreadProfilingRequest, UUID>,
    private val threadProfilinLogKrud: Krud<ThreadProfilingLog, UUID>,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {

    @Scheduled(fixedRate = 1000)
    fun runProfiling() {
        val runningThreadProfilings = threadProfilingRequestKrud.searchByFilter {
            where {
                ThreadProfilingRequest::status Equal ThreadProfilingStatus.RUNNING
            }
        }

        log.debug { "Running thread profiling request ids - ${runningThreadProfilings.results.map { it.id }.joinToString(",")}" }

        val expired = runningThreadProfilings.filter { it.finishTime.time < System.currentTimeMillis() }
        expired.forEach {
            updateProfilingRequestToFinished(it.id)
        }

        val groupedByInstance = runningThreadProfilings.filter { !expired.any { request -> request == it } }.groupBy { it.instanceId }

        groupedByInstance.forEach { (instanceId, requests) ->
            log.debug("Getting thread dump for instance $instanceId")
            val instance = instanceService.getInstanceOrThrow(instanceId)
            val threadDumpRequest = actuatorClientProvider.provide(instance).threadDump()
            threadDumpRequest.onSuccess { threadDump ->
                requests.forEach { request ->
                    val threadLog = ThreadProfilingLog(request.id, threadDump.threads)
                    threadProfilinLogKrud.create(threadLog)
                }
            }
        }
    }

    fun getLogsForRequest(requestId: UUID): PagedResult<ThreadProfilingLog> {
        val request = getProfilingRequestByIdOrThrow(requestId)
        val filter = where {
            ThreadProfilingLog::requestId Equal requestId
        }

        return threadProfilinLogKrud.searchByFilter(filter)
    }

    private fun getProfilingRequestByIdOrThrow(requestId: UUID): ThreadProfilingRequest {
        return threadProfilingRequestKrud.showById(requestId) ?: throwNotFound("Thread Profiling Request $requestId not found")
    }

    private fun updateProfilingRequestToFinished(id: UUID) {
        log.debug { "Update thread profiling request to finished $id" }
        threadProfilingRequestKrud.updateByFilter(
            false,
            {
                where {
                    ThreadProfilingRequest::id Equal id
                }
            }
        ) {
            status = ThreadProfilingStatus.FINISHED
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}