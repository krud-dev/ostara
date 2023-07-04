package dev.ostara.agent.service

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import java.nio.file.Files
import java.nio.file.Paths

@Service
@Profile("kubernetes")
class KubernetesAwarenessService {
  private val namespace = try {
    Files.readString(Paths.get("/var/run/secrets/kubernetes.io/serviceaccount/namespace"))
  } catch (e: Exception) {
    null
  }

  fun getHostname(): String? {
    return System.getenv(HOSTNAME)
  }

  fun getNamespace(): String? {
    return namespace
  }

  companion object {
    private const val HOSTNAME = "HOSTNAME"
  }
}
