package dev.krud.boost.daemon.metricmonitor.rule

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

fun stubApplicationMetricRule(
    id: UUID = UUID.randomUUID(),
    metricName: ParsedMetricName = ParsedMetricName.from("example.metric[VALUE]"),
    operation: ApplicationMetricRuleOperation = ApplicationMetricRuleOperation.GREATER_THAN,
    value1: Double = 1.0,
    value2: Double? = null,
    enabled: Boolean = true,
    applicationId: UUID = UUID.randomUUID()
): ApplicationMetricRule {
    return ApplicationMetricRule(
        metricName.toString(),
        operation,
        value1,
        value2,
        enabled,
        applicationId
    ).apply {
        this.id = id
    }
}