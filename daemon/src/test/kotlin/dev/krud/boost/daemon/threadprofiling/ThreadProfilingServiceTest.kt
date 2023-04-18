package dev.krud.boost.daemon.threadprofiling

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.web.server.ResponseStatusException
import strikt.api.expect
import strikt.api.expectThrows
import strikt.assertions.contains
import strikt.assertions.isEqualTo
import java.util.*

class ThreadProfilingServiceTest {
    private val instanceService: InstanceService = mock()
    private val threadProfilingRequestKrud = TestKrud<ThreadProfilingRequest, UUID>(ThreadProfilingRequest::class.java)
    private val threadProfilinLogKrud = TestKrud<ThreadProfilingLog, UUID>(ThreadProfilingLog::class.java)
    private val actuatorClientProvider: InstanceActuatorClientProvider = mock()
    private val instanceThreadProfilingProgressChannel: PublishSubscribeChannel = mock()

    private val threadProfilingService: ThreadProfilingService = ThreadProfilingService(
        instanceService,
        threadProfilingRequestKrud,
        threadProfilinLogKrud,
        actuatorClientProvider,
        instanceThreadProfilingProgressChannel
    )

    @Test
    fun `getLogsForRequest should return correct logs for request`() {
        val request = threadProfilingRequestKrud
            .create(stubThreadProfilingRequest())
        val log1 = threadProfilinLogKrud.create(
            stubThreadProfilingLog(requestId = request.id)
        )
        val log2 = threadProfilinLogKrud.create(
            stubThreadProfilingLog(requestId = request.id)
        )
        val log3 = threadProfilinLogKrud.create(
            stubThreadProfilingLog() // unrelated log, should not be returned
        )

        val result = threadProfilingService.getLogsForRequest(request.id)

        expect {
            that(result.results.size)
                .isEqualTo(2)
            that(result.results)
                .contains(log1)
            that(result.results)
                .contains(log2)
        }
    }

    @Test
    fun `getLogsForRequest should throw if request does not exist`() {
        expectThrows<ResponseStatusException> {
            threadProfilingService.getLogsForRequest(UUID.randomUUID())
        }
    }
}