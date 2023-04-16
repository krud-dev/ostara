package dev.krud.boost.daemon.base.config

import dev.krud.boost.daemon.configuration.application.websocket.ApplicationHealthWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.heapdump.websocket.InstanceHeapdumpWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricWebsocketTopicInterceptor
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceAbilityWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceHealthWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceHostnameWebsocketDispatcher
import dev.krud.boost.daemon.threadprofiling.websocket.ThreadProfilingWebsocketDispatcher
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
    private lateinit var subscriptionInterceptors: List<SubscriptionInterceptor>

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker("/topic", "/queue")
        registry.setApplicationDestinationPrefixes("/app")
    }

    override fun configureClientInboundChannel(registration: ChannelRegistration) {
        registration.interceptors(instanceMetricWebsocketTopicInterceptor, *subscriptionInterceptors.toTypedArray())
    }

    @Configuration
    class HealthReplayingInterceptors {
        @Bean
        fun applicationHealthReplayingInterceptor(applicationHealthWebsocketDispatcher: ApplicationHealthWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ApplicationHealthWebsocketDispatcher.APPLICATION_HEALTH_TOPIC,
            callback = { message, headerAccessor ->
                applicationHealthWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHealthReplayingInterceptor(instanceHealthWebsocketDispatcher: InstanceHealthWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHealthWebsocketDispatcher.INSTANCE_HEALTH_TOPIC,
            callback = { message, headerAccessor ->
                instanceHealthWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHostnameReplayingInterceptor(instanceHostnameWebsocketDispatcher: InstanceHostnameWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHostnameWebsocketDispatcher.INSTANCE_HOSTNAME_TOPIC,
            callback = { message, headerAccessor ->
                instanceHostnameWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHeapdumpReplayingInterceptor(instanceHeapdumpWebsocketDispatcher: InstanceHeapdumpWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHeapdumpWebsocketDispatcher.HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC,
            callback = { message, headerAccessor ->
                instanceHeapdumpWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun threadProfilingReplayingInterceptor(threadProfilingWebsocketDispatcher: ThreadProfilingWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ThreadProfilingWebsocketDispatcher.THREAD_PROFILING_PROGRESS_TOPIC,
            callback = { message, headerAccessor ->
                threadProfilingWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceAbilityReplayingInterceptor(instanceAbilityWebsocketDispatcher: InstanceAbilityWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceAbilityWebsocketDispatcher.INSTANCE_ABILITY_TOPIC,
            callback = { message, headerAccessor ->
                instanceAbilityWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )
    }
}