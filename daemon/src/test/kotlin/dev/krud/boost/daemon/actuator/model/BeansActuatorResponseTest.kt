package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class BeansActuatorResponseTest {
    private val objectMapper = jacksonObjectMapper()

    @Test
    fun `BeanActuatorResponse should deserialize from empty json`() {
        val json = "{}"
        val response = objectMapper.readValue(json, BeansActuatorResponse::class.java)
        expectThat(response).isEqualTo(BeansActuatorResponse())
    }

    @Test
    fun `BeanActuatorResponse Context should deserialize from empty json`() {
        val json = "{}"
        val response = objectMapper.readValue(json, BeansActuatorResponse.Context::class.java)
        expectThat(response).isEqualTo(BeansActuatorResponse.Context())
    }
}