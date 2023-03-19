package dev.krud.boost.daemon.configuration.instance.metric

import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
import org.springframework.context.annotation.Lazy
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.*
import java.util.concurrent.ConcurrentHashMap

@Component
class InstanceMetricWebsocketTopicInterceptor(
    private val instanceService: InstanceService,
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate,
    private val instanceMetricService: InstanceMetricService,
    private val instanceHealthService: InstanceHealthService
) : ChannelInterceptor {
    private val subscriptions = ConcurrentHashMap<String, Set<String>>()
    private val previousValueCache = ConcurrentHashMap<String, List<InstanceMetricValueRO>>()

    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*>? {
        val headerAccessor = StompHeaderAccessor.wrap(message)
        when (headerAccessor.command) {
            StompCommand.SUBSCRIBE -> handleSubscribe(headerAccessor)
            StompCommand.UNSUBSCRIBE -> handleUnsubscribe(headerAccessor)
            StompCommand.DISCONNECT -> handleDisconnect(headerAccessor)
            else -> {}
        }
        return message
    }

    @Scheduled(fixedRate = 5000)
    protected fun processTopics() {
        if (subscriptions.isEmpty()) {
            return
        }

        val memoizedHealth = mutableMapOf<UUID, Boolean>()
        for (topic in subscriptions.values.flatten().toSet()) {
            val (instanceId, metricName) = InstanceMetricWebsocketUtil.parseMetricAndInstanceIdFromTopic(topic)
            val up = memoizedHealth.computeIfAbsent(instanceId) {
                instanceHealthService.getHealth(instanceId).status == InstanceHealthStatus.UP
            }
            if (!up) {
                continue
            }
            val metric = runCatching {
                instanceMetricService.getLatestMetric(instanceId, metricName)
            }
                .getOrNull()
                ?: continue
            val previousValues = previousValueCache[topic]
            if (previousValues != null && previousValues == metric.values) {
                continue
            }
            previousValueCache[topic] = metric.values
            messagingTemplate.convertAndSend(topic, metric)
        }
    }

    private fun handleSubscribe(headerAccessor: StompHeaderAccessor) {
        val destination = headerAccessor.destination ?: return
        if (!InstanceMetricWebsocketUtil.isValidMetricTopic(destination)) {
            return
        }

        val (instanceId) = InstanceMetricWebsocketUtil.parseMetricAndInstanceIdFromTopic(destination)
        // todo: perform lighter ifexists check
        instanceService.getInstanceOrThrow(instanceId)
        val sessionId = headerAccessor.sessionId ?: return
        val currentSubscriptions = subscriptions[sessionId] ?: emptySet()
        subscriptions[sessionId] = currentSubscriptions + destination
    }

    private fun handleUnsubscribe(headerAccessor: StompHeaderAccessor) {
        val destination = headerAccessor.subscriptionId ?: return
        if (!InstanceMetricWebsocketUtil.isValidMetricTopic(destination)) {
            return
        }

        val sessionId = headerAccessor.sessionId ?: return
        val currentSubscriptions = subscriptions[sessionId] ?: emptySet()
        val newSubscriptions = currentSubscriptions - destination
        if (newSubscriptions.isEmpty()) {
            subscriptions.remove(sessionId)
        } else {
            subscriptions[sessionId] = newSubscriptions
        }
    }

    private fun handleDisconnect(headerAccessor: StompHeaderAccessor) {
        val sessionId = headerAccessor.sessionId ?: return
        subscriptions.remove(sessionId)
    }
}