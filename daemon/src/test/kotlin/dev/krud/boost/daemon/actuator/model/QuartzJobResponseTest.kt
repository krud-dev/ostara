package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class QuartzJobResponseTest {
    private val objectMapper = jacksonObjectMapper()

    @Test
    fun `QuartzJobResponse should deserialize from empty json`() {
        val json = "{}"
        val response = objectMapper.readValue(json, QuartzJobResponse::class.java)
        expectThat(response).isEqualTo(QuartzJobResponse())
    }

    @Test
    fun `QuartzJobResponse Trigger should deserialize from empty json`() {
        val json = "{}"
        val response = objectMapper.readValue(json, QuartzJobResponse.Trigger::class.java)
        expectThat(response).isEqualTo(QuartzJobResponse.Trigger())
    }
}