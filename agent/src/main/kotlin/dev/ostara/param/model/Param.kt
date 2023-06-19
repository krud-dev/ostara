package dev.ostara.param.model

import dev.ostara.param.model.ParamSchema.Companion.getInt
import dev.ostara.param.model.ParamSchema.Companion.getString

data class Param(
  val schema: ParamSchema,
  val value: String?
) {
  companion object {
    fun Param.getString(): String? = schema.getString(value)
    fun Param.getInt(): Int? = schema.getInt(value)
  }
}

