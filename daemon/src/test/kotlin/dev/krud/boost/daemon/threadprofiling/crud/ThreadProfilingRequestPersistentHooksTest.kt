package dev.krud.boost.daemon.threadprofiling.crud

import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.stubThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.stubThreadProfilingRequest
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.util.*

class ThreadProfilingRequestPersistentHooksTest {
    private val threadProfilingLogKrud = TestKrud(ThreadProfilingLog::class.java)
    private val instanceService: InstanceService = mock()
    private val threadProfilingRequestPersistentHooks = ThreadProfilingRequestPersistentHooks(threadProfilingLogKrud, instanceService)

    @Test
    fun `onCreate should set finish time to current + durationSec`() {
        val entity = stubThreadProfilingRequest(
            durationSec = 100
        )
        val expectedFinishTime = Date(
            System.currentTimeMillis() + (entity.durationSec * 1000)
        )
        threadProfilingRequestPersistentHooks.onCreate(entity)
        expectThat(entity.finishTime)
            .isEqualTo(expectedFinishTime)
    }

    @Test
    fun `onDelete should cascade delete all related logs`() {
        val entity = stubThreadProfilingRequest()
        threadProfilingLogKrud.create(
            stubThreadProfilingLog(
                requestId = entity.id
            )
        )
        threadProfilingLogKrud.create(
            stubThreadProfilingLog() // unrelated log, should not be deleted
        )
        threadProfilingRequestPersistentHooks.onDelete(entity)
        expectThat(threadProfilingLogKrud.entities.size)
            .isEqualTo(1)
    }
}