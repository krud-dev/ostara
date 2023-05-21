package dev.krud.boost.daemon.metricmonitor.rule.model

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.parsedMetricName
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.crudframework.crud.annotation.PersistCopyOnFetch
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.JoinColumn
import jakarta.persistence.Lob
import jakarta.persistence.ManyToOne

@Entity
@DefaultMappingTarget(ApplicationMetricRuleRO::class)
@PersistCopyOnFetch
class ApplicationMetricRule(
    @Column(nullable = false)
    @MappedField
    @Lob
    var metricName: String,
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @MappedField
    var operation: ApplicationMetricRuleOperation,
    @Column(nullable = false)
    @MappedField
    var value1: Double,
    @Column(nullable = true)
    @MappedField
    var value2: Double? = null,
    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false, updatable = false)
    var application: Application,
    @Column(nullable = false, columnDefinition = "boolean default true")
    @MappedField
    var enabled: Boolean = true
) : AbstractEntity() {
    companion object {
        val ApplicationMetricRule.parsedMetricName: ParsedMetricName get() = ParsedMetricName.from(metricName)
    }
}