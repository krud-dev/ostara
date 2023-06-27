package dev.krud.boost.daemon.jackson

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode

/**
 * Deserialize a property value to a string, even if it's a number or boolean.
 */
class ToStringDeserializer : JsonDeserializer<String>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): String {
        val node = p.codec.readTree<JsonNode>(p)
        return node?.toString() ?: ""
    }
}