package dev.krud.boost.daemon.utils

import dev.krud.boost.daemon.jackson.ParsedDate
import java.util.*

object TypeDefaults {
    val UUID = UUID(0L, 0L)
    val DATE = Date(0L)
    val STRING = ""
    val INT = 0
    val LONG = 0L
    val FLOAT = 0.0f
    val DOUBLE = 0.0
    val BOOLEAN = false
    val CHAR = ' '
    val BYTE = 0.toByte()
    val SHORT = 0.toShort()
    val PARSED_DATE = ParsedDate()
}