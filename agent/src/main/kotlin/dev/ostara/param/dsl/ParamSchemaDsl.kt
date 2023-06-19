package dev.ostara.param.dsl

import dev.ostara.param.model.ParamSchema
import dev.ostara.param.model.ParamType

@DslMarker
annotation class ParamSchemaDsl

@ParamSchemaDsl
class ParamSchemasBuilder {
  private val paramSchemas = mutableListOf<ParamSchema>()
  fun <T> param(name: String, type: ParamType, action: ParamSchemaBuilder<T>.() -> Unit) {
    val builder = ParamSchemaBuilder<T>(
      name,
      type
    )
    builder.action()
    paramSchemas += builder.build()
  }

  fun stringParam(name: String, action: ParamSchemaBuilder<String>.() -> Unit) {
    param(name, ParamType.STRING, action)
  }

  fun intParam(name: String, action: ParamSchemaBuilder<Int>.() -> Unit) {
    param(name, ParamType.INT, action)
  }

  fun build(): List<ParamSchema> = paramSchemas.toList()

  @ParamSchemaDsl
  inner class ParamSchemaBuilder<T>(private val name: String, private val type: ParamType) {
    var description: String? = null
    var required: Boolean = false
    var defaultValue: T? = null
    var validOptions: List<T>? = null

    fun build(): ParamSchema {
      return ParamSchema(
        name = name,
        type = type,
        description = description ?: "The $name parameter",
        required = required,
        defaultValue = defaultValue?.toString(),
        validOptions = validOptions?.map { it.toString() }
      )
    }
  }

}


fun params(action: ParamSchemasBuilder.() -> Unit): List<ParamSchema> {
  val builder = ParamSchemasBuilder()
  builder.action()
  return builder.build()
}

