package dev.ostara.agent.param.model

import kotlin.reflect.KClass

enum class ParamType(val primitive: KClass<*>) {
  STRING(String::class), INT(Int::class)
}
