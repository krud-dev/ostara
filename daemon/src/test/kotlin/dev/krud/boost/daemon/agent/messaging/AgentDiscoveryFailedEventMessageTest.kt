package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.WebSocketForwardingInterceptor
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.isEqualTo
import java.util.*

class AgentDiscoveryFailedEventMessageTest {
    @Test
    fun `message should have correct websocket header`() {
        val message = AgentDiscoveryFailedEventMessage(
            AgentDiscoveryFailedEventMessage.Payload(UUID.randomUUID(), null)
        )
        expect {
            that(message.headers[WebSocketForwardingInterceptor.TOPIC]).isEqualTo(WebsocketTopics.AGENT_DISCOVERY_FAILURE)
            that(message.headers[WebSocketForwardingInterceptor.REPLAY_GROUP]).isEqualTo(message.payload.agentId.toString())
        }
    }
}