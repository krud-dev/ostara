package dev.krud.boost.daemon.agent.model

import kotlin.reflect.KClass

enum class ParamType(val primitive: KClass<*>) {
  STRING(String::class), INT(Int::class)
}
