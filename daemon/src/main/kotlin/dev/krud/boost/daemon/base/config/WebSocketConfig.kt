package dev.krud.boost.daemon.base.config

import dev.krud.boost.daemon.agent.websocket.AgentHealthWebsocketDispatcher
import dev.krud.boost.daemon.configuration.application.websocket.ApplicationCreationWebsocketDispatcher
import dev.krud.boost.daemon.configuration.application.websocket.ApplicationDeletionWebsocketDispatcher
import dev.krud.boost.daemon.configuration.application.websocket.ApplicationHealthWebsocketDispatcher
import dev.krud.boost.daemon.configuration.application.websocket.ApplicationUpdateWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.heapdump.websocket.InstanceHeapdumpWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricWebsocketTopicInterceptor
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceAbilityWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceCreationWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceDeletionWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceHealthWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceHostnameWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceMetadataWebsocketDispatcher
import dev.krud.boost.daemon.configuration.instance.websocket.InstanceUpdateWebsocketDispatcher
import dev.krud.boost.daemon.metricmonitor.websocket.MetricRuleWebsocketDispatcher
import dev.krud.boost.daemon.threadprofiling.websocket.ThreadProfilingWebsocketDispatcher
import dev.krud.boost.daemon.websocket.SubscriptionInterceptor
import dev.krud.boost.daemon.websocket.replay.InboundWebsocketReplayingInterceptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
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
        registration.interceptors(instanceMetricWebsocketTopicInterceptor, inboundWebsocketReplayingInterceptor, *subscriptionInterceptors.toTypedArray())
    }

    @Configuration
    class HealthReplayingInterceptors {
        @Bean
        fun applicationHealthReplayingInterceptor(applicationHealthWebsocketDispatcher: ApplicationHealthWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ApplicationHealthWebsocketDispatcher.APPLICATION_HEALTH_TOPIC,
            callback = { _, headerAccessor ->
                applicationHealthWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHealthReplayingInterceptor(instanceHealthWebsocketDispatcher: InstanceHealthWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHealthWebsocketDispatcher.INSTANCE_HEALTH_TOPIC,
            callback = { _, headerAccessor ->
                instanceHealthWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHostnameReplayingInterceptor(instanceHostnameWebsocketDispatcher: InstanceHostnameWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHostnameWebsocketDispatcher.INSTANCE_HOSTNAME_TOPIC,
            callback = { _, headerAccessor ->
                instanceHostnameWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceHeapdumpReplayingInterceptor(instanceHeapdumpWebsocketDispatcher: InstanceHeapdumpWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceHeapdumpWebsocketDispatcher.HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC,
            callback = { _, headerAccessor ->
                instanceHeapdumpWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun threadProfilingReplayingInterceptor(threadProfilingWebsocketDispatcher: ThreadProfilingWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ThreadProfilingWebsocketDispatcher.THREAD_PROFILING_PROGRESS_TOPIC,
            callback = { _, headerAccessor ->
                threadProfilingWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceAbilityReplayingInterceptor(instanceAbilityWebsocketDispatcher: InstanceAbilityWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceAbilityWebsocketDispatcher.INSTANCE_ABILITY_TOPIC,
            callback = { _, headerAccessor ->
                instanceAbilityWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun applicationMetricRuleTriggersReplayingInterceptor(metricRuleWebsocketDispatcher: MetricRuleWebsocketDispatcher) = SubscriptionInterceptor(
            destination = MetricRuleWebsocketDispatcher.APPLICATION_METRIC_RULE_TRIGGERS_TOPIC,
            callback = { _, headerAccessor ->
                metricRuleWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceMetadataReplayingInterceptor(instanceMetadataWebsocketDispatcher: InstanceMetadataWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceMetadataWebsocketDispatcher.INSTANCE_METADATA_TOPIC,
            callback = { _, headerAccessor ->
                instanceMetadataWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceCreationReplayingInterceptor(instanceCreationWebsocketDispatcher: InstanceCreationWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceCreationWebsocketDispatcher.INSTANCE_CREATION_TOPIC,
            callback = { _, headerAccessor ->
                instanceCreationWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceUpdateReplayingInterceptor(instanceUpdateWebsocketDispatcher: InstanceUpdateWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceUpdateWebsocketDispatcher.INSTANCE_UPDATE_TOPIC,
            callback = { _, headerAccessor ->
                instanceUpdateWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun instanceDeletionReplayingInterceptor(instanceDeletionWebsocketDispatcher: InstanceDeletionWebsocketDispatcher) = SubscriptionInterceptor(
            destination = InstanceDeletionWebsocketDispatcher.INSTANCE_DELETION_TOPIC,
            callback = { _, headerAccessor ->
                instanceDeletionWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun applicationCreationReplayingInterceptor(applicationCreationWebsocketDispatcher: ApplicationCreationWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ApplicationCreationWebsocketDispatcher.APPLICATION_CREATION_TOPIC,
            callback = { _, headerAccessor ->
                applicationCreationWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun applicationUpdateReplayingInterceptor(applicationUpdateWebsocketDispatcher: ApplicationUpdateWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ApplicationUpdateWebsocketDispatcher.APPLICATION_UPDATE_TOPIC,
            callback = { _, headerAccessor ->
                applicationUpdateWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun applicationDeletionReplayingInterceptor(applicationDeletionWebsocketDispatcher: ApplicationDeletionWebsocketDispatcher) = SubscriptionInterceptor(
            destination = ApplicationDeletionWebsocketDispatcher.APPLICATION_DELETION_TOPIC,
            callback = { _, headerAccessor ->
                applicationDeletionWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )

        @Bean
        fun agentHealthReplayingInterceptor(agentHealthWebsocketDispatcher: AgentHealthWebsocketDispatcher) = SubscriptionInterceptor(
            destination = AgentHealthWebsocketDispatcher.AGENT_HEALTH_TOPIC,
            callback = { _, headerAccessor ->
                agentHealthWebsocketDispatcher.replay(headerAccessor.sessionId!!)
            }
        )
    }
}