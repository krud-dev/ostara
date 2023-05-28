package dev.krud.boost.daemon.utils

import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.transformer.base.MappingTransformerContext
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isNull
import kotlin.reflect.jvm.javaField

class ParsedMetricNameToStringTransformerTest {
    private val transformer = ParsedMetricNameToStringTransformer()
    private val fieldStub = ParsedMetricName::name.javaField!! // Just to fulfill the Field properties
    private val shapeShift = ShapeShiftBuilder().build()
    @Test
    fun `transform should transform parsed metric name to string`() {
        val parsedMetricName = ParsedMetricName("test", "VALUE", mapOf("first" to "value", "second" to "value"))
        val result = transformer.transform(
            MappingTransformerContext(
                parsedMetricName,
                mock(),
                mock(),
                fieldStub,
                fieldStub,
                shapeShift
            )
        )
        expectThat(result)
            .isEqualTo("test[VALUE]?first=value&second=value")
    }

    @Test
    fun `transform should transform parsed metric name to string without tags`() {
        val parsedMetricName = ParsedMetricName("test", "VALUE")
        val result = transformer.transform(
            MappingTransformerContext(
                parsedMetricName,
                mock(),
                mock(),
                fieldStub,
                fieldStub,
                shapeShift
            )
        )
        expectThat(result)
            .isEqualTo("test[VALUE]")
    }

    @Test
    fun `transform should transform null to null`() {
        val result = transformer.transform(
            MappingTransformerContext(
                null,
                mock(),
                mock(),
                fieldStub,
                fieldStub,
                shapeShift
            )
        )
        expectThat(result)
            .isNull()
    }
}