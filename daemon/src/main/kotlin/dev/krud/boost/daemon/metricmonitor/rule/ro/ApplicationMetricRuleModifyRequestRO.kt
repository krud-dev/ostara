package dev.krud.boost.daemon.metricmonitor.rule.ro

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.validation.ValidMetricName
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import java.util.*

@DefaultMappingTarget(ApplicationMetricRule::class)
class ApplicationMetricRuleModifyRequestRO(
    @MappedField
    var name: String? = null,
    @MappedField
    @get:ValidMetricName
    var metricName: String,
    @MappedField
    var operation: ApplicationMetricRuleOperation,
    @MappedField
    var value1: Double,
    @MappedField
    var value2: Double?,
    @MappedField
    var enabled: Boolean,
    @MappedField
    var applicationId: UUID,
)