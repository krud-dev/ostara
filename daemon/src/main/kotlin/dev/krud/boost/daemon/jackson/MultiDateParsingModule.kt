package dev.krud.boost.daemon.jackson

import com.fasterxml.jackson.databind.module.SimpleModule
import java.util.*

class MultiDateParsingModule : SimpleModule() {
    init {
        addDeserializer(ParsedDate::class.java, MultiDateDeserializer())
    }
}