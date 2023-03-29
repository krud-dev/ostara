package dev.krud.boost.daemon.base.config

import dev.krud.boost.daemon.configuration.application.listeners.ApplicationHealthListener
import dev.krud.boost.daemon.configuration.instance.InstanceHealthListener
import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricWebsocketTopicInterceptor
import dev.krud.boost.daemon.websocket.SubscriptionInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
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
    private lateinit var applicationHealthReplayingInterceptor: SubscriptionInterceptor

    @Autowired
    private lateinit var instanceHealthReplayingInterceptor: SubscriptionInterceptor

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker("/topic", "/queue")
        registry.setApplicationDestinationPrefixes("/app")
    }

    override fun configureClientInboundChannel(registration: ChannelRegistration) {
        registration.interceptors(instanceMetricWebsocketTopicInterceptor, applicationHealthReplayingInterceptor, instanceHealthReplayingInterceptor)
    }

    @Configuration
    class HealthReplayingInterceptors {
        @Bean
        fun applicationHealthReplayingInterceptor(applicationHealthListener: ApplicationHealthListener) = SubscriptionInterceptor(
            destination = ApplicationHealthListener.APPLICATION_HEALTH_TOPIC,
            callback = { message, headerAccessor ->
                applicationHealthListener.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHealthReplayingInterceptor(instanceHealthListener: InstanceHealthListener) = SubscriptionInterceptor(
            destination = InstanceHealthListener.INSTANCE_HEALTH_TOPIC,
            callback = { message, headerAccessor ->
                instanceHealthListener.replay(headerAccessor.sessionId!!)
            }
        )
    }
}