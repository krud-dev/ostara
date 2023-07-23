package dev.krud.boost.daemon.base.config

import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricWebsocketTopicInterceptor
import dev.krud.boost.daemon.websocket.replay.InboundWebsocketReplayingInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Lazy
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig : WebSocketMessageBrokerConfigurer {
    @Autowired
    private lateinit var instanceMetricWebsocketTopicInterceptor: InstanceMetricWebsocketTopicInterceptor

    @Autowired
    @Lazy
    private lateinit var inboundWebsocketReplayingInterceptor: InboundWebsocketReplayingInterceptor

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker("/topic", "/queue")
        registry.setApplicationDestinationPrefixes("/app")
    }

    override fun configureClientInboundChannel(registration: ChannelRegistration) {
        registration.interceptors(instanceMetricWebsocketTopicInterceptor, inboundWebsocketReplayingInterceptor)
    }
}