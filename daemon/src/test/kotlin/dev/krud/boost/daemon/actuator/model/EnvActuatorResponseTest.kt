package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.isEqualTo

class EnvActuatorResponseTest {
    private val objectMapper = jacksonObjectMapper()

    @Test
    fun `response should deserialize non-string value as string`() {
        val json = """
        {
          "propertySources": [
            {
              "name": "source",
              "properties": {
                "some.value": {
                  "value": {}
                }
              }
            }
          ]
        }
        """.trimIndent()

        val response = objectMapper.readValue(json, EnvActuatorResponse::class.java)
        expect {
            that(response.propertySources[0].properties!!["some.value"]!!.value).isEqualTo("{}")
        }
    }
}