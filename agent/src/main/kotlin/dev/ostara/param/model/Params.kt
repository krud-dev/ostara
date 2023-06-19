package dev.ostara.param.model

import dev.ostara.param.model.Param.Companion.getInt
import dev.ostara.param.model.Param.Companion.getString

data class Params(
  val list: List<Param>
) {
  fun <T> resolve() = ParamDelegator<T?>(this)
  fun <T> resolveRequired() = ParamDelegator<T>(this)

  companion object {
    fun Params.getString(name: String): String? = list.find { it.schema.name == name }?.getString()
    fun Params.getInt(name: String): Int? = list.find { it.schema.name == name }?.getInt()
    fun fromMap(schemas: List<ParamSchema>, parameters: Map<String, String?>): Params {
      return Params(schemas.map { Param(it, parameters[it.name]) })
    }
  }
}
