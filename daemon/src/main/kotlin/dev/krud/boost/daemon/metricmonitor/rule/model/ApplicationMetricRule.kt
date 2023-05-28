package dev.krud.boost.daemon.metricmonitor.rule.model

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.crudframework.crud.annotation.Deleteable
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
import java.util.*
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@Entity
@DefaultMappingTarget(ApplicationMetricRuleRO::class)
@PersistCopyOnFetch
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
class ApplicationMetricRule(
    @Column(nullable = false, updatable = false)
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
    @Column(nullable = false, columnDefinition = "boolean default true")
    @MappedField
    var enabled: Boolean = true,
    @Column(name = "application_id", nullable = false, updatable = false)
    var applicationId: UUID
) : AbstractEntity() {

    @Column(nullable = true)
    @MappedField
    var name: String? = null

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false, updatable = false, insertable = false)
    var application: Application? = null

    companion object {
        val ApplicationMetricRule.parsedMetricName: ParsedMetricName get() = ParsedMetricName.from(metricName)

        @ExperimentalContracts
        fun ApplicationMetricRule?.evaluate(value: Double?): Boolean {
            contract {
                returns(true) implies (this@evaluate != null)
            }
            this ?: return false
            value ?: return false

            return when (operation) {
                ApplicationMetricRuleOperation.GREATER_THAN -> value > value1
                ApplicationMetricRuleOperation.BETWEEN -> value > value1 && value < (value2 ?: return false)
                ApplicationMetricRuleOperation.LOWER_THAN -> value < value1
            }
        }
    }
}