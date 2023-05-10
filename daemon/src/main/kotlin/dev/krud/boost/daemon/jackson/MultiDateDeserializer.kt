package dev.krud.boost.daemon.jackson

import com.cobber.fta.dates.DateTimeParser
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import dev.krud.boost.daemon.utils.toDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatterBuilder
import java.time.temporal.ChronoField
import java.util.*
import java.util.concurrent.atomic.AtomicReference

/**
 * Used to dynamically detect the type of date being deserialized
 * It is a sticky deserializer, meaning that once it has determined the type of date it is deserializing it will not attempt to determine the type again
 */
class MultiDateDeserializer : StdDeserializer<ParsedDate?> {
    constructor() : super(Date::class.java)
    constructor(vc: Class<*>?) : super(vc)

    private var dateType: AtomicReference<ValueType?> = AtomicReference(null)
    private var formatter: AtomicReference<DateTimeFormatter?> = AtomicReference(null)

    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): ParsedDate? {
        val node: JsonNode = p.codec.readTree(p)
        if (node.isNull) {
            return null
        }
        val type = determineType(node)
        val date = when (type) {
            ValueType.STRING -> {
                LocalDateTime.parse(node.asText(), formatter.get())
                    .toDate()
            }

            ValueType.MILLIS_NUMBER -> Date(node.asLong())
            ValueType.SECONDS_NUMBER -> Date(node.asLong() * 1000)
            ValueType.UNKNOWN -> {
                null
            }
        }
        return ParsedDate(
            date,
            node.asText()
        )
    }

    private fun determineType(node: JsonNode): ValueType {
        val currentDeterminedType = dateType.get()
        if (currentDeterminedType != null) {
            return currentDeterminedType
        }
        val determinedType = if (node.isNumber) {
            val timestamp = node.asLong()
            if (timestamp > 1000000000000) { // Possibly dealing with a timestamp in milliseconds
                ValueType.MILLIS_NUMBER
            } else {
                ValueType.SECONDS_NUMBER
            }
        } else {
            val pattern = PARSER.determineFormatString(node.asText())
            if (pattern == null || pattern.contains("?")) {
                ValueType.UNKNOWN
            } else {
                val dateTimeFormatter = DateTimeFormatterBuilder().appendPattern(pattern)
                    .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
                    .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
                    .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
                    .toFormatter()
                formatter.set(dateTimeFormatter)
                ValueType.STRING
            }
        }
        dateType.set(determinedType)
        return determinedType
    }

    private enum class ValueType {
        STRING,
        MILLIS_NUMBER,
        SECONDS_NUMBER,
        UNKNOWN
    }

    companion object {
        private val PARSER = DateTimeParser()
    }
}