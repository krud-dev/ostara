package dev.krud.boost.daemon.utils

import java.util.*

fun UUID.toShortString(): String {
    return this.toString().substring(0, 8)
}