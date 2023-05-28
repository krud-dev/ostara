package dev.krud.boost.daemon.metricmonitor.rule.ro

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.ParsedMetricNameToStringTransformer
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(ApplicationMetricRule::class)
class ApplicationMetricRuleCreateRequestRO(
    @MappedField
    @get:NotBlank
    var name: String,
    @MappedField(transformer = ParsedMetricNameToStringTransformer::class)
    var metricName: ParsedMetricName,
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