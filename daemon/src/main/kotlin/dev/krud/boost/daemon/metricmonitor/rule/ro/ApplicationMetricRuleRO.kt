package dev.krud.boost.daemon.metricmonitor.rule.ro

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.TypeDefaults
import java.util.*

class ApplicationMetricRuleRO(
    var id: UUID = TypeDefaults.UUID,
    var name: String = TypeDefaults.STRING,
    var metricName: ParsedMetricName = ParsedMetricName.DEFAULT,
    var operation: ApplicationMetricRuleOperation? = null,
    var value1: Double = TypeDefaults.DOUBLE,
    var value2: Double? = null,
    var enabled: Boolean = TypeDefaults.BOOLEAN
)