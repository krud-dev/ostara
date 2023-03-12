package dev.krud.boost.daemon.jackson

import java.util.*

data class ParsedDate(
    val date: Date? = null,
    val original: String? = null
)