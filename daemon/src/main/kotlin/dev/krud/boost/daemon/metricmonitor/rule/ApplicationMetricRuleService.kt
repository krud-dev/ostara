package dev.krud.boost.daemon.metricmonitor.rule

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.metricmonitor.MetricManager
import dev.krud.boost.daemon.metricmonitor.messaging.InstanceMetricUpdatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.ApplicationMetricRuleService.RuleInstanceAssociation.Companion.isRelevant
import dev.krud.boost.daemon.metricmonitor.rule.ApplicationMetricRuleService.RuleInstanceAssociation.Companion.updateValue
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleCreatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDeletedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDisabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleEnabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.InstanceApplicationMetricRuleTriggeredMessage
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.evaluate
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.parsedDivisorMetricName
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.parsedMetricName
import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.computeIfAbsent
import dev.krud.boost.daemon.utils.getTyped
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PostConstruct
import org.springframework.cache.Cache
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*
import kotlin.contracts.ExperimentalContracts

@Service
class ApplicationMetricRuleService(
    private val metricManager: MetricManager,
    private val applicationService: ApplicationService,
    private val applicationMetricRuleKrud: Krud<ApplicationMetricRule, UUID>,
    private val instanceApplicationMetricRuleTriggerChannel: PublishSubscribeChannel,
    private val cacheManager: CacheManager,
    private val shapeShift: ShapeShift
) {
    private val ruleInstanceAssociationCache: Cache by cacheManager.resolve()

    @PostConstruct
    fun initialize() {
        applicationMetricRuleKrud.searchByFilter {
            where {
                ApplicationMetricRule::enabled Equal true
            }
        }
            .forEach { rule -> rule.initialize() }
    }

    @ServiceActivator(inputChannel = "applicationMetricRuleChannel")
    fun onApplicationMetricRuleEvent(message: Message<*>) {
        log.debug { "onApplicationMetricRuleEvent: $message" }
        when (message) {
            is ApplicationMetricRuleCreatedMessage -> {
                log.debug { "Metric Rule created: ${message.payload.applicationMetricRuleId}, initializing" }
                val rule = applicationMetricRuleKrud.showById(message.payload.applicationMetricRuleId)
                if (rule?.enabled == true) {
                    rule.initialize()
                }
            }

            is ApplicationMetricRuleDeletedMessage -> {
                log.debug { "Metric Rule deleted: ${message.payload.applicationMetricRuleId}, uninitializing" }
                uninitializeRule(message.payload.applicationMetricRuleId, message.payload.applicationId)
            }

            is ApplicationMetricRuleDisabledMessage -> {
                log.debug { "Metric Rule disabled: ${message.payload.applicationMetricRuleId}, uninitializing" }
                uninitializeRule(message.payload.applicationMetricRuleId, message.payload.applicationId)
            }

            is ApplicationMetricRuleEnabledMessage -> {
                log.debug { "Metric Rule enabled: ${message.payload.applicationMetricRuleId}, initializing" }
                val rule = applicationMetricRuleKrud.showById(message.payload.applicationMetricRuleId)
                rule?.initialize()
            }
        }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onSystemEvent(message: Message<*>) {
        when (message) {
            is InstanceDeletedEventMessage -> {
                ruleInstanceAssociationCache.evict(message.payload.instanceId)
            }

            is InstanceCreatedEventMessage -> {
                applicationMetricRuleKrud.searchByFilter {
                    where {
                        ApplicationMetricRule::applicationId Equal message.payload.parentApplicationId
                        ApplicationMetricRule::enabled Equal true
                    }
                }.forEach { rule ->
                    rule.initializeForInstance(message.payload.instanceId)
                }
            }

            is InstanceMovedEventMessage -> {
                if (message.payload.oldParentApplicationId == message.payload.newParentApplicationId) {
                    return
                }

                ruleInstanceAssociationCache.getTyped<List<RuleInstanceAssociation>>(message.payload.instanceId)
                    ?.let { associations ->
                        associations.forEach { association ->
                            metricManager.releaseMetric(message.payload.instanceId, association.metricName)
                            association.divisorMetricName?.let { metricManager.releaseMetric(message.payload.instanceId, it) }
                        }
                    }
                ruleInstanceAssociationCache.evict(message.payload.instanceId)
                applicationMetricRuleKrud.searchByFilter {
                    where {
                        ApplicationMetricRule::applicationId Equal message.payload.newParentApplicationId
                        ApplicationMetricRule::enabled Equal true
                    }
                }.forEach { rule ->
                    rule.initializeForInstance(message.payload.instanceId)
                }
            }
        }
    }

    @ServiceActivator(inputChannel = "instanceMetricUpdatedChannel")
    @ExperimentalContracts
    fun onMetricUpdated(message: InstanceMetricUpdatedMessage) {
        log.trace {
            "onMetricUpdated: ${message.payload.instanceId}, ${message.payload.metricName}, ${message.payload.newValue}"
        }
        val associations = ruleInstanceAssociationCache.getTyped<List<RuleInstanceAssociation>>(message.payload.instanceId) ?: return
        if (associations.isEmpty()) {
            return
        }

        associations.forEach { association ->
            if (association.isRelevant(message.payload.metricName)) {
                val value = association.updateValue(message.payload.metricName, (message.payload.newValue?.value?.value ?: return)) ?: return
                val rule = applicationMetricRuleKrud.showById(association.applicationMetricRuleId)
                log.debug { "Evaluating rule: ${rule?.id}" }
                if (rule.evaluate(association.lastEvaluationValue)) {
                    if (association.lastTriggered == null || association.lastTriggered!!.time < System.currentTimeMillis() - COOLDOWN) {
                        log.debug { "Triggering rule: ${rule.id}" }
                        instanceApplicationMetricRuleTriggerChannel.send(
                            InstanceApplicationMetricRuleTriggeredMessage(
                                InstanceApplicationMetricRuleTriggeredMessage.Payload(
                                    shapeShift.map<ApplicationMetricRule, ApplicationMetricRuleRO>(rule),
                                    message.payload.instanceId,
                                    value
                                )
                            )
                        )
                    } else {
                        log.debug { "Rule on cooldown: ${rule.id}" }
                    }
                    association.lastTriggered = Date()
                }
            }
        }
    }

    private fun ApplicationMetricRule.initialize() {
        val parsedMetricName = this.parsedMetricName
        val instances = applicationService.getApplicationInstances(this.applicationId)
        instances.forEach { instance ->
            metricManager.requestMetric(instance.id, parsedMetricName)
            this.parsedDivisorMetricName?.let { parsedDivisorMetricName ->
                metricManager.requestMetric(instance.id, parsedDivisorMetricName)
            }
            ruleInstanceAssociationCache.computeIfAbsent<MutableList<RuleInstanceAssociation>>(instance.id) { mutableListOf() }
                .add(RuleInstanceAssociation(this.id, this.applicationId, parsedMetricName, parsedDivisorMetricName))

        }
    }


    private fun ApplicationMetricRule.initializeForInstance(instanceId: UUID) {
        val parsedMetricName = this.parsedMetricName
        metricManager.requestMetric(instanceId, parsedMetricName)
        this.parsedDivisorMetricName?.let { parsedDivisorMetricName ->
            metricManager.requestMetric(instanceId, parsedDivisorMetricName)
        }
        ruleInstanceAssociationCache.computeIfAbsent<MutableList<RuleInstanceAssociation>>(instanceId) { mutableListOf() }
            .add(RuleInstanceAssociation(this.id, this.applicationId, parsedMetricName, parsedDivisorMetricName))
    }

    private fun uninitializeRule(applicationMetricRuleId: UUID, applicationId: UUID) {
        val instances = applicationService.getApplicationInstances(applicationId)
        instances.forEach { instance ->
            ruleInstanceAssociationCache.getTyped<MutableList<RuleInstanceAssociation>>(instance.id)?.removeIf {
                val condition = it.applicationMetricRuleId == applicationMetricRuleId
                if (condition) {
                    metricManager.releaseMetric(instance.id, it.metricName)
                    it.divisorMetricName?.let { divisorMetricName ->
                        metricManager.releaseMetric(instance.id, divisorMetricName)
                    }
                }
                condition
            }
        }
    }


    internal data class RuleInstanceAssociation(
        val applicationMetricRuleId: UUID,
        val parentApplicationId: UUID,
        val metricName: ParsedMetricName,
        val divisorMetricName: ParsedMetricName? = null,
        var lastMetricValue: Double? = null,
        var lastDivisorMetricValue: Double? = null,
        var lastEvaluationValue: Double? = null,
        var lastEvaluation: Date? = null,
        var lastTriggered: Date? = null,
    ) {
        companion object {
            fun RuleInstanceAssociation.isRelevant(metricName: ParsedMetricName): Boolean =
                this.metricName == metricName || this.divisorMetricName == metricName

            fun RuleInstanceAssociation.updateValue(metricName: ParsedMetricName, value: Double): Double? {
                if (this.metricName == metricName) {
                    this.lastMetricValue = value
                } else if (this.divisorMetricName == metricName) {
                    this.lastDivisorMetricValue = value
                }
                lastEvaluation = Date()
                lastEvaluationValue = lastMetricValue?.div(lastDivisorMetricValue ?: 1.0)
                return lastEvaluationValue
            }
        }
    }

    companion object {
        private const val COOLDOWN = 1000L * 60L
        private val log = KotlinLogging.logger { }
    }
}