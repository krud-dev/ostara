package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleCreateRequestRO
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleModifyRequestRO
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/applicationMetricRule")
@Tag(name = "Application Metric Rule", description = "Application Metric Rule API")
class ApplicationMetricRuleController(
    private val shapeShift: ShapeShift,
    private val applicationMetricRuleKrud: Krud<ApplicationMetricRule, UUID>
) : AbstractCrudController<ApplicationMetricRule, ApplicationMetricRuleRO, ApplicationMetricRuleCreateRequestRO, ApplicationMetricRuleModifyRequestRO>(ApplicationMetricRule::class, ApplicationMetricRuleRO::class, shapeShift, applicationMetricRuleKrud)