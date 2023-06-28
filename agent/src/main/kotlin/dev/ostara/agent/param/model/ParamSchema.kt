package dev.ostara.agent.param.model

import dev.ostara.agent.servicediscovery.handler.ServiceDiscoveryHandler
import io.ktor.server.plugins.requestvalidation.*

data class ParamSchema(
  val name: String,
  val type: ParamType,
  val description: String = "The $name parameter",
  val required: Boolean = false,
  val defaultValue: String? = null,
  val validOptions: List<String>? = null
) {
  companion object {
    fun ParamSchema.getString(value: String?): String? {
      if (value == null) {
        if (required && defaultValue == null) {
          error("required parameter not provided")
        }
        return defaultValue
      }
      return value
    }

    fun ParamSchema.getInt(value: String?): Int? {
      return getString(value)?.toInt()
    }

    fun ParamSchema.validate(value: String?) {
      if (required && value == null && defaultValue == null) {
        error("required parameter not provided")
      }
      if (value != null && validOptions != null && value !in validOptions) {
        error("invalid option, must be one of: ${validOptions.joinToString(", ")}")
      }
    }
    fun Collection<ParamSchema>.validate(value: Map<String, String?>) {
      val errors = mutableListOf<String>()
      forEach {
        runCatching {
          it.validate(value[it.name])
        }
          .onFailure { e -> errors += "${it.name}: ${e.message}" }
      }
      value.entries.forEach {
        if (none { param -> param.name == it.key }) {
          errors += "${it.key}: unknown parameter"
        }
      }
      if (errors.isNotEmpty()) {
        throw RequestValidationException("Validation failed", errors)
      }
    }

    fun ServiceDiscoveryHandler.validate(value: Map<String, String?>) {
      params.validate(value)
    }
  }
}
