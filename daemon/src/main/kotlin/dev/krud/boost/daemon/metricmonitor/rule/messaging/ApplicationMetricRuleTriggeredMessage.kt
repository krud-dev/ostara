package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

class ApplicationMetricRuleTriggeredMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleTriggeredMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val applicationMetricRuleId: UUID,
        val operation: ApplicationMetricRuleOperation,
        val applicationId: UUID,
        val metricName: ParsedMetricName,
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
                    applicationMetricRuleId = first.payload.applicationMetricRuleId,
                    operation = first.payload.operation,
                    applicationId = first.payload.applicationId,
                    metricName = first.payload.metricName,
                    instanceIdsAndValues = instanceIdsAndValues
                )
            )
        }
    }
}