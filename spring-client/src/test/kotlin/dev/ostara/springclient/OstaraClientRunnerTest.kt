package dev.ostara.springclient

import dev.ostara.springclient.config.OstaraClientProperties
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify

class OstaraClientRunnerTest {
  private val client = mock<OstaraAgentClient>()
  private val registrationRequest = RegistrationRequest(
    appName = "appName",
    host = "host",
    managementUrl = "managementUrl"
  )
  private val ostaraClientProperties = OstaraClientProperties()
    .apply {
      runnerIntervalSeconds = 1
    }
  private val runner = OstaraClientRunner(
    client,
    registrationRequest,
    ostaraClientProperties
  )

  @Test
  fun `runner should deregister on destroy if initialized`() {
    runner.afterPropertiesSet()
    runner.destroy()
    verify(client, times(1)).deregister(registrationRequest)
  }

  @Test
  fun `runner should not deregister on destroy if not initialized`() {
    runner.destroy()
    verify(client, never()).deregister(registrationRequest)
  }

  @Test
  fun `runner should register after init, every N interval`() {
    runner.afterPropertiesSet()
    Thread.sleep(100) // Account for the initial delay
    verify(client, times(1)).register(registrationRequest)
    Thread.sleep(1000)
    verify(client, times(2)).register(registrationRequest)
  }
}
