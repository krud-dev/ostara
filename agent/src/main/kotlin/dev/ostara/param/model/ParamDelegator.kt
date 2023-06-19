package dev.ostara.param.model

import dev.ostara.param.model.Param.Companion.getInt
import dev.ostara.param.model.Param.Companion.getString
import kotlin.reflect.KProperty

class ParamDelegator<T>(private val params: Params) {
  operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
    val theParam = params.list.find { it.schema.name == property.name }
      ?: error("Parameter ${property.name} not found")
    if (theParam.schema.type.primitive != property.returnType.classifier) {
      error("Parameter ${property.name} is not of type ${property.returnType.classifier}")
    }

    return when(theParam.schema.type) {
      ParamType.STRING -> theParam.getString() as T
      ParamType.INT -> theParam.getInt() as T
    }
  }
}
