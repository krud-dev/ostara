package dev.krud.boost.daemon.threadprofiling.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import java.util.UUID

class ThreadProfilingProgressMessage(
    payload: Payload
) : AbstractMessage<ThreadProfilingProgressMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val requestId: UUID,
        val instanceId: UUID,
        val secondsRemaining: Long,
        val status: ThreadProfilingStatus
    )
}