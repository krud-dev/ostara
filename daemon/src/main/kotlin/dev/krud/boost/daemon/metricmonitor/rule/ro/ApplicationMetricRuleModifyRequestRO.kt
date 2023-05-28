package dev.krud.boost.daemon.metricmonitor.rule.ro

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(ApplicationMetricRule::class)
class ApplicationMetricRuleModifyRequestRO(
    @MappedField
    @get:NotBlank
    var name: String,
    @MappedField
    var operation: ApplicationMetricRuleOperation,
    @MappedField
    var value1: Double,
    @MappedField
    var value2: Double?,
    @MappedField
    var enabled: Boolean
)