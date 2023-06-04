package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import java.util.*

class ApplicationMetricRuleTriggeredMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleTriggeredMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val applicationMetricRule: ApplicationMetricRuleRO,
        val instanceIdsAndValues: Set<InstanceIdAndValue>
    )

    @GenerateTypescript
    data class InstanceIdAndValue(
        val instanceId: UUID,
        val value: Double,
    )

    companion object {
        fun from(messages: Collection<InstanceApplicationMetricRuleTriggeredMessage>): ApplicationMetricRuleTriggeredMessage? {
            if (messages.isEmpty()) {
                return null
            }
            val first = messages.first()
            val instanceIdsAndValues = messages.map { InstanceIdAndValue(it.payload.instanceId, it.payload.value) }.toSet()
            return ApplicationMetricRuleTriggeredMessage(
                Payload(
                    applicationMetricRule = first.payload.applicationMetricRule,
                    instanceIdsAndValues = instanceIdsAndValues
                )
            )
        }
    }
}