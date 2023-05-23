package dev.krud.boost.daemon.metricmonitor.rule

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.metricmonitor.MetricManager
import dev.krud.boost.daemon.metricmonitor.messaging.InstanceMetricUpdatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleCreatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDeletedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDisabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleEnabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.InstanceApplicationMetricRuleTriggeredMessage
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.evaluate
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.parsedMetricName
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.computeIfAbsent
import dev.krud.boost.daemon.utils.getTyped
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.KotlinLogging
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
    private val cacheManager: CacheManager
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
            if (association.metricName == message.payload.metricName) {
                val value = message.payload.newValue?.value?.value ?: return@forEach
                association.lastValue = value
                association.lastEvaluation = Date()
                val rule = applicationMetricRuleKrud.showById(association.applicationMetricRuleId)
                log.debug { "Evaluating rule: ${rule?.id}"}
                if(rule.evaluate(association.lastValue)) {
                    if (association.lastTriggered == null || association.lastTriggered!!.time < System.currentTimeMillis() - COOLDOWN) {
                        log.debug { "Triggering rule: ${rule.id}"}
                        instanceApplicationMetricRuleTriggerChannel.send(
                            InstanceApplicationMetricRuleTriggeredMessage(
                                InstanceApplicationMetricRuleTriggeredMessage.Payload(
                                    rule.id,
                                    rule.operation,
                                    rule.applicationId,
                                    message.payload.instanceId,
                                    rule.parsedMetricName,
                                    value
                                )
                            )
                        )
                    } else {
                        log.debug { "Rule on cooldown: ${rule.id}"}
                    }
                    association.lastTriggered = Date()
                }
            }
        }
    }

    private fun ApplicationMetricRule.initialize() {
        val metricName = this.parsedMetricName
        val instances = applicationService.getApplicationInstances(this.applicationId)
        instances.forEach { instance ->
            metricManager.requestMetric(instance.id, metricName)
            ruleInstanceAssociationCache.computeIfAbsent<MutableList<RuleInstanceAssociation>>(instance.id) { mutableListOf() }
                .add(RuleInstanceAssociation(this.id, this.applicationId, metricName))

        }
    }


    private fun ApplicationMetricRule.initializeForInstance(instanceId: UUID) {
        val metricName = this.parsedMetricName
        metricManager.requestMetric(instanceId, metricName)
        ruleInstanceAssociationCache.computeIfAbsent<MutableList<RuleInstanceAssociation>>(instanceId) { mutableListOf() }
            .add(RuleInstanceAssociation(this.id, this.applicationId, metricName))
    }

    private fun uninitializeRule(applicationMetricRuleId: UUID, applicationId: UUID) {
        val instances = applicationService.getApplicationInstances(applicationId)
        instances.forEach { instance ->
            ruleInstanceAssociationCache.getTyped<MutableList<RuleInstanceAssociation>>(instance.id)?.removeIf {
                val condition = it.applicationMetricRuleId == applicationMetricRuleId
                if (condition) {
                    metricManager.releaseMetric(instance.id, it.metricName)
                }
                condition
            }
        }
    }


    internal data class RuleInstanceAssociation(
        val applicationMetricRuleId: UUID,
        val parentApplicationId: UUID,
        val metricName: ParsedMetricName,
        var lastValue: Double? = null,
        var lastEvaluation: Date? = null,
        var lastTriggered: Date? = null,
    )

    companion object {
        private const val COOLDOWN = 1000L * 60L
        private val log = KotlinLogging.logger { }
    }
}