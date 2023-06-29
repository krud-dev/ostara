package dev.ostara.springclient

import org.springframework.beans.factory.DisposableBean
import org.springframework.beans.factory.InitializingBean
import java.util.*
import kotlin.concurrent.timer

class OstaraClientRunner(
  private val ostaraAgentClient: OstaraAgentClient,
  private val registrationRequest: RegistrationRequest
) : InitializingBean, DisposableBean {
  private lateinit var registrationTimer: Timer

  override fun afterPropertiesSet() {
    println("Starting Ostara Client...")
    registrationTimer = timer("ostaraRegistration", false, 0, 10_000) {
      println("Registering with Ostara Agent...")
      runCatching {
        ostaraAgentClient.register(registrationRequest)
      }
        .onSuccess {
          println("Successfully registered with Ostara Agent")
        }
        .onFailure {
          println("Failed to register with Ostara Agent ${it.message}")
//          it.printStackTrace()
        }
    }
  }

  override fun destroy() {
    println("Deregistering with Ostara Agent...")
    registrationTimer.cancel()
    ostaraAgentClient.deregister(registrationRequest)
  }
}
