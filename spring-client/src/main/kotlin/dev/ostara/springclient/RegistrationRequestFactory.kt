package dev.ostara.springclient

import dev.ostara.springclient.config.OstaraClientProperties
import dev.ostara.springclient.util.resolveHostname
import org.springframework.beans.factory.FactoryBean
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementServerProperties
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.boot.web.server.Ssl
import org.springframework.context.ApplicationContext
import java.net.InetAddress

class RegistrationRequestFactory(
  private val applicationContext: ApplicationContext,
  private val ostaraClientProperties: OstaraClientProperties,
  private val serverProperties: ServerProperties,
  private val managementServerProperties: ManagementServerProperties,
  private val webEndpointProperties: WebEndpointProperties
) : FactoryBean<RegistrationRequest> {
  override fun getObjectType(): Class<*>? {
    return RegistrationRequest::class.java
  }

  override fun getObject(): RegistrationRequest {
    return RegistrationRequest(
      getApplicationName(),
      getManagementHost(),
      "${getManagementScheme()}://${getManagementHost()}:${getManagementPort()}${getManagementContextPath()}",
    )
  }

  private fun getApplicationName(): String {
    val appName = ostaraClientProperties.applicationName
    if (appName.isNotBlank()) {
      return appName
    }
    val contextId = applicationContext.id
    if (contextId.isNullOrBlank()) {
      error("Unable to determine application name. <<TODO>>")
    }
    return contextId
  }

  private fun getManagementScheme(): String {
    val managementSsl = getManagementSsl()
    if (managementSsl != null) {
      return "https"
    }
    return "http"
  }

  private fun getManagementSsl(): Ssl? {
    val managementSsl = managementServerProperties.ssl
    if (managementSsl != null) {
      return managementSsl
    }
    return getServiceSsl()
  }

  private fun getManagementHost(): String {
    val address = getManagementAddress()
    return address.resolveHostname()
  }

  private fun getManagementAddress(): InetAddress {
    val managementAddress = managementServerProperties.address
    if (managementAddress != null) {
      return managementAddress
    }
    return getServiceAddress()
  }

  private fun getManagementContextPath(): String {
    return webEndpointProperties.basePath
  }

  private fun getManagementPort(): Int {
    val managementPort = managementServerProperties.port
    if (managementPort != null) {
      return managementPort
    }
    return getServicePort()
  }

  private fun getServiceScheme(): String {
    val serviceSsl = getServiceSsl()
    if (serviceSsl != null) {
      return "https"
    }
    return "http"
  }

  private fun getServiceSsl(): Ssl? {
    return serverProperties.ssl
  }

  private fun getServiceHost(): String {
    val address = getServiceAddress()
    return address.resolveHostname()
  }

  private fun getServiceAddress(): InetAddress {
    val serverAddress = serverProperties.address
    if (serverAddress != null) {
      return serverAddress
    }
    val localAddress = InetAddress.getLocalHost()
    if (localAddress != null) {
      return localAddress
    }
    error("Unable to determine service address. <<TODO>>")
  }

  private fun getServicePort(): Int {
    val serverPort = serverProperties.port
    if (serverPort != null) {
      return serverPort
    }
    error("Unable to determine service port. <<TODO>>")
  }
}
