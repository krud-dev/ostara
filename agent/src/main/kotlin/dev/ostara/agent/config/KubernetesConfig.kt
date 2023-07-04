package dev.ostara.agent.config

import dev.ostara.agent.config.condition.ConditionalOnKubernetesEnabled
import io.fabric8.kubernetes.client.KubernetesClient
import io.fabric8.kubernetes.client.KubernetesClientBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.nio.file.Files
import java.nio.file.Paths

@Configuration
@ConditionalOnKubernetesEnabled
class KubernetesConfig(
  private val serviceDiscoveryProperties: ServiceDiscoveryProperties
) {
  @Bean
  fun kubernetesClient(): KubernetesClient {
    val config = serviceDiscoveryProperties.kubernetes!!
    val builder = KubernetesClientBuilder()
    val kubeConfigPath = config.kubeConfigPath
    val kubeConfig = config.kubeConfigYaml
      ?: if (kubeConfigPath != null) {
        Files.readString(Paths.get(kubeConfigPath))
      } else {
        null
      }
    if (kubeConfig != null) {
      builder.withConfig(kubeConfig)
    }
    return builder.build()
  }
}
