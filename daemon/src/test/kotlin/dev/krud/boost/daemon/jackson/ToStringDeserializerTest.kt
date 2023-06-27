package dev.krud.boost.daemon.jackson

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class ToStringDeserializerTest {
    private val objectMapper = jacksonObjectMapper()
    private val deserializer = ToStringDeserializer()

    @Test
    fun `ToStringDeserializer should return stringified object value`() {
        val parser = objectMapper.factory.createParser("{}")
        val result = deserializer.deserialize(
            parser,
            objectMapper.deserializationContext,
        )
        expectThat(result).isEqualTo("{}")
    }
}