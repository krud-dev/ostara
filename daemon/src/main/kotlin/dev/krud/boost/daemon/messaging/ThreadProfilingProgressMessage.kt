package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class ThreadProfilingProgressMessage(
    payload: Payload
) : AbstractMessage<ThreadProfilingProgressMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.INSTANCE_THREAD_PROFILING_PROGRESS,
        payload.requestId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val requestId: UUID,
        val instanceId: UUID,
        val secondsRemaining: Long,
        val status: ThreadProfilingStatus
    )
}