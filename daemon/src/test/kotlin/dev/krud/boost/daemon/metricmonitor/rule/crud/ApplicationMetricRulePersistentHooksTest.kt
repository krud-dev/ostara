package dev.krud.boost.daemon.metricmonitor.rule.crud

import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleCreatedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDeletedMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleDisabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleEnabledMessage
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.metricmonitor.rule.stubApplicationMetricRule
import org.junit.jupiter.api.Test
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.springframework.integration.channel.PublishSubscribeChannel
import strikt.api.expect
import strikt.assertions.isEqualTo

class ApplicationMetricRulePersistentHooksTest {
    private val applicationMetricRuleChannel: PublishSubscribeChannel = mock()
    private val applicationMetricRulePersistentHooks = ApplicationMetricRulePersistentHooks(applicationMetricRuleChannel)

    @Test
    fun `postCreate should send event`() {
        val rule = stubApplicationMetricRule()
        applicationMetricRulePersistentHooks.postCreate(rule)
        val messageCaptor = argumentCaptor<ApplicationMetricRuleCreatedMessage>()
        verify(applicationMetricRuleChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expect {
            that(message.payload.applicationMetricRuleId).isEqualTo(rule.id)
            that(message.payload.applicationId).isEqualTo(rule.applicationId)
            that(message.payload.enabled).isEqualTo(rule.enabled)
        }
    }

    @Test
    fun `postDelete should send event`() {
        val rule = stubApplicationMetricRule()
        applicationMetricRulePersistentHooks.postDelete(rule)
        val messageCaptor = argumentCaptor<ApplicationMetricRuleDeletedMessage>()
        verify(applicationMetricRuleChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expect {
            that(message.payload.applicationMetricRuleId).isEqualTo(rule.id)
            that(message.payload.applicationId).isEqualTo(rule.applicationId)
        }
    }

    @Test
    fun `postUpdate on rule enabled should send event`() {
        val rule = stubApplicationMetricRule(enabled = false)
        rule.saveOrGetCopy()
        rule.enabled = true
        applicationMetricRulePersistentHooks.postUpdate(rule)
        val messageCaptor = argumentCaptor<ApplicationMetricRuleEnabledMessage>()
        verify(applicationMetricRuleChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expect {
            that(message.payload.applicationMetricRuleId).isEqualTo(rule.id)
            that(message.payload.applicationId).isEqualTo(rule.applicationId)
        }
    }

    @Test
    fun `postUpdate on rule disabled should send event`() {
        val rule = stubApplicationMetricRule(enabled = true)
        rule.saveOrGetCopy()
        rule.enabled = false
        applicationMetricRulePersistentHooks.postUpdate(rule)
        val messageCaptor = argumentCaptor<ApplicationMetricRuleDisabledMessage>()
        verify(applicationMetricRuleChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expect {
            that(message.payload.applicationMetricRuleId).isEqualTo(rule.id)
            that(message.payload.applicationId).isEqualTo(rule.applicationId)
        }
    }
}