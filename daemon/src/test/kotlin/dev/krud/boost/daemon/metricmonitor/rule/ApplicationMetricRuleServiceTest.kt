package dev.krud.boost.daemon.metricmonitor.rule

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.metricmonitor.MetricManager
import dev.krud.boost.daemon.metricmonitor.messaging.InstanceMetricUpdatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleCreatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDeletedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDisabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleEnabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.InstanceApplicationMetricRuleTriggeredMessage
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule.Companion.parsedMetricName
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.getTyped
import dev.krud.boost.daemon.utils.resolve
import dev.krud.boost.daemon.utils.withParsedMetricNameTransformers
import dev.krud.shapeshift.ShapeShiftBuilder
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.integration.channel.PublishSubscribeChannel
import strikt.api.expect
import strikt.api.expectThat
import strikt.assertions.doesNotContain
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import strikt.assertions.isNull
import java.util.*
import kotlin.contracts.ExperimentalContracts

class ApplicationMetricRuleServiceTest {
    private val metricManager: MetricManager = mock()
    private val applicationService: ApplicationService = mock()
    private val applicationMetricRuleKrud = TestKrud(ApplicationMetricRule::class.java) { UUID.randomUUID() }
    private val instanceApplicationMetricRuleTriggerChannel: PublishSubscribeChannel = mock()
    private val cacheManager = ConcurrentMapCacheManager("ruleInstanceAssociationCache")
    private val ruleInstanceAssociationCache by cacheManager.resolve()
    private val shapeShift = ShapeShiftBuilder()
        .withParsedMetricNameTransformers()
        .build()
    private val applicationMetricRuleService = ApplicationMetricRuleService(
        metricManager,
        applicationService,
        applicationMetricRuleKrud,
        instanceApplicationMetricRuleTriggerChannel,
        cacheManager,
        shapeShift

    )

    @Test
    fun `initialize should initialize all enabled rules`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )
        applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id, enabled = false),
        ) // Create a disabled rule that should not be initialized

        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )

        applicationMetricRuleService.initialize()
        validateRuleInit(instance, rule, application)
    }

    @Test
    fun `on event ApplicationMetricRuleEnabledMessage should initialize the created rule`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        validateRuleInit(instance, rule, application)
    }

    @Test
    fun `on event ApplicationMetricRuleCreatedMessage should initialize the created rule`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )

        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleCreatedMessage(
                ApplicationMetricRuleCreatedMessage.Payload(
                    rule.id,
                    application.id,
                    true
                )
            )
        )

        validateRuleInit(instance, rule, application)
    }

    @Test
    fun `on event ApplicationMetricRuleDeletedMessage should uninitialize the deleted rule`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )
        // First, enable the rule to register it
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        // Then, delete it to test the uninitialization
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleDeletedMessage(
                ApplicationMetricRuleDeletedMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        validateRuleUninit(instance, rule, application)
    }

    @Test
    fun `on event ApplicationMetricRuleDisabledMessage should uninitialize the deleted rule`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )
        // First, enable the rule to register it
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        // Then, disable it to test the uninitialization
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleDisabledMessage(
                ApplicationMetricRuleDisabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        validateRuleUninit(instance, rule, application)
    }

    @Test
    fun `on event InstanceDeletedEventMessage should evict instance from cache`() {
        val instance = stubInstance()
        ruleInstanceAssociationCache.put(instance.id, mutableListOf<ApplicationMetricRuleService.RuleInstanceAssociation>())
        applicationMetricRuleService.onSystemEvent(
            InstanceDeletedEventMessage(
                InstanceDeletedEventMessage.Payload(
                    instance.id,
                    instance.parentApplicationId
                )
            )
        )
        expectThat(ruleInstanceAssociationCache.get(instance.id)).isNull()
    }

    @Test
    fun `on event InstanceCreatedEventMessage should initialize rules related to instance's application`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )

        applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id, enabled = false),
        ) // Create a disabled rule that should not be initialized

        applicationMetricRuleService.onSystemEvent(
            InstanceCreatedEventMessage(
                InstanceCreatedEventMessage.Payload(
                    instance.id,
                    instance.parentApplicationId
                )
            )
        )
        validateRuleInit(instance, rule, application)
    }

    @Test
    fun `on event InstanceMovedEventMessage, uninitialize old application rules and initialize new application rules`() {
        val oldApplication = stubApplication()
        val newApplication = stubApplication()
        val instance = stubInstance(parentApplicationId = oldApplication.id)
        val oldRule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = oldApplication.id),
        )
        val newRule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = newApplication.id),
        )

        whenever(applicationService.getApplicationInstances(oldApplication.id)).thenReturn(
            listOf(instance)
        )

        whenever(applicationService.getApplicationInstances(newApplication.id)).thenReturn(
            listOf(instance)
        )

        // Initialize the old rule
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    oldRule.id,
                    oldApplication.id
                )
            )
        )

        applicationMetricRuleService.onSystemEvent(
            InstanceMovedEventMessage(
                InstanceMovedEventMessage.Payload(
                    instance.id,
                    oldApplication.id,
                    newApplication.id,
                    0.0
                )
            )
        )

        validateRuleUninit(instance, oldRule, oldApplication)
        validateRuleInit(instance, newRule, newApplication, 2)
    }

    @Test
    fun `on event InstanceMovedEventMessage should do nothing if app wasn't changed`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id),
        )

        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )

        // Initialize the rule
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )

        applicationMetricRuleService.onSystemEvent(
            InstanceMovedEventMessage(
                InstanceMovedEventMessage.Payload(
                    instance.id,
                    application.id,
                    application.id,
                    0.0
                )
            )
        )

        validateRuleInit(instance, rule, application)
        verify(metricManager, never()).releaseMetric(instance.id, rule.parsedMetricName)
    }

    @Test
    @ExperimentalContracts
    fun `onMetricUpdated with no active associations should do nothing`() {
        val instance = stubInstance()
        applicationMetricRuleService.onMetricUpdated(
            InstanceMetricUpdatedMessage(
                InstanceMetricUpdatedMessage.Payload(
                    instance.id,
                    instance.parentApplicationId,
                    ParsedMetricName.from("test[VALUE]"),
                    InstanceMetricRO.from("test[VALUE", 0.0),
                    InstanceMetricRO.from("test[VALUE", 1.0)
                )
            )
        )
    }

    @Test
    @ExperimentalContracts
    fun `onMetricUpdated with active association of non matching rule should update the rule without triggering`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id, operation = ApplicationMetricRuleOperation.GREATER_THAN, value1 = 5.0),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )
        applicationMetricRuleService.onMetricUpdated(
            InstanceMetricUpdatedMessage(
                InstanceMetricUpdatedMessage.Payload(
                    instance.id,
                    instance.parentApplicationId,
                    rule.parsedMetricName,
                    InstanceMetricRO.from(rule.parsedMetricName.name, 0.0),
                    InstanceMetricRO.from(rule.parsedMetricName.name, 1.0)
                )
            )
        )
        val cached = ruleInstanceAssociationCache.getTyped<List<ApplicationMetricRuleService.RuleInstanceAssociation>>(instance.id)
        expect {
            that(cached).isNotNull()
            val first = cached?.firstOrNull {
                it.applicationMetricRuleId == rule.id &&
                it.parentApplicationId == application.id &&
                it.metricName == rule.parsedMetricName
            }
            that(first).isNotNull()
            that(first!!.lastValue).isEqualTo(1.0)
            that(first.lastEvaluation).isNotNull()
            that(first.lastTriggered).isNull()
        }
        verify(instanceApplicationMetricRuleTriggerChannel, never()).send(any())
    }

    @Test
    @ExperimentalContracts
    fun `onMetricUpdated with active association of matching rule should update the rule and trigger it`() {
        val application = stubApplication()
        val instance = stubInstance(parentApplicationId = application.id)
        val rule = applicationMetricRuleKrud.create(
            stubApplicationMetricRule(applicationId = application.id, operation = ApplicationMetricRuleOperation.GREATER_THAN, value1 = 50.0),
        )
        whenever(applicationService.getApplicationInstances(application.id)).thenReturn(
            listOf(instance)
        )
        applicationMetricRuleService.onApplicationMetricRuleEvent(
            ApplicationMetricRuleEnabledMessage(
                ApplicationMetricRuleEnabledMessage.Payload(
                    rule.id,
                    application.id
                )
            )
        )
        applicationMetricRuleService.onMetricUpdated(
            InstanceMetricUpdatedMessage(
                InstanceMetricUpdatedMessage.Payload(
                    instance.id,
                    instance.parentApplicationId,
                    rule.parsedMetricName,
                    InstanceMetricRO.from(rule.parsedMetricName.name, 1.0),
                    InstanceMetricRO.from(rule.parsedMetricName.name, 51.0)
                )
            )
        )
        val messageCaptor = argumentCaptor<InstanceApplicationMetricRuleTriggeredMessage>()
        verify(instanceApplicationMetricRuleTriggerChannel, times(1)).send(messageCaptor.capture())
        val cached = ruleInstanceAssociationCache.getTyped<List<ApplicationMetricRuleService.RuleInstanceAssociation>>(instance.id)
        val message = messageCaptor.firstValue
        expect {
            that(cached).isNotNull()
            val first = cached?.firstOrNull {
                it.applicationMetricRuleId == rule.id &&
                it.parentApplicationId == application.id &&
                it.metricName == rule.parsedMetricName
            }
            that(first).isNotNull()
            that(first!!.lastValue).isEqualTo(51.0)
            that(first.lastEvaluation).isNotNull()
            that(first.lastTriggered).isNotNull()
            that(message.payload.applicationMetricRule.id).isEqualTo(rule.id)
            that(message.payload.applicationMetricRule.applicationId).isEqualTo(application.id)
            that(message.payload.applicationMetricRule.operation).isEqualTo(rule.operation)
            that(message.payload.applicationMetricRule.metricName).isEqualTo(rule.parsedMetricName)
            that(message.payload.applicationMetricRule.name).isEqualTo(rule.name)
            that(message.payload.applicationMetricRule.value1).isEqualTo(rule.value1)
            that(message.payload.applicationMetricRule.value2).isEqualTo(rule.value2)
            that(message.payload.instanceId).isEqualTo(instance.id)
            that(message.payload.value).isEqualTo(51.0)
        }
    }

    private fun validateRuleInit(
        instance: Instance,
        rule: ApplicationMetricRule,
        application: Application,
        desiredNumberOfRequestCalls: Int = 1
    ) {
        verify(metricManager, times(desiredNumberOfRequestCalls)).requestMetric(instance.id, rule.parsedMetricName)
        val cached = ruleInstanceAssociationCache.getTyped<List<ApplicationMetricRuleService.RuleInstanceAssociation>>(instance.id)
        expect {
            that(cached).isNotNull()
            val first = cached!!.firstOrNull {
                it.applicationMetricRuleId == rule.id &&
                it.parentApplicationId == application.id &&
                it.metricName == rule.parsedMetricName
            }
            that(first).isNotNull()
        }
    }

    private fun validateRuleUninit(
        instance: Instance,
        rule: ApplicationMetricRule,
        application: Application
    ) {
        verify(metricManager, times(1)).releaseMetric(instance.id, rule.parsedMetricName)
        val cached = ruleInstanceAssociationCache.getTyped<List<ApplicationMetricRuleService.RuleInstanceAssociation>>(instance.id)
        expect {
            that(cached).isNotNull()
            that(cached!!).doesNotContain(
                ApplicationMetricRuleService.RuleInstanceAssociation(
                    rule.id,
                    application.id,
                    rule.parsedMetricName,
                    null,
                    null,
                    null
                )
            )
        }
    }
}