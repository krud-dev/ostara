package dev.krud.boost.daemon.utils

import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.transformer.base.MappingTransformerContext
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isNull
import kotlin.reflect.jvm.javaField

class StringToParsedMetricNameTransformerTest {
    private val transformer = StringToParsedMetricNameTransformer()
    private val fieldStub = ParsedMetricName::name.javaField!! // Just to fulfill the Field properties
    private val shapeShift = ShapeShiftBuilder().build()

    @Test
    fun `transform should transform string to parsed metric name`() {
        val expected = ParsedMetricName("test", "VALUE", mapOf("first" to "value", "second" to "value"))
        val result = transformer.transform(
            MappingTransformerContext(
                "test[VALUE]?first=value&second=value",
                mock(),
                mock(),
                fieldStub,
                fieldStub,
                shapeShift
            )
        )

        expectThat(result)
            .isEqualTo(expected)
    }

    @Test
    fun `transform should transform string to parsed metric name without tags`() {
        val expected = ParsedMetricName("test", "VALUE")
        val result = transformer.transform(
            MappingTransformerContext(
                "test[VALUE]",
                mock(),
                mock(),
                fieldStub,
                fieldStub,
                shapeShift
            )
        )

        expectThat(result)
            .isEqualTo(expected)
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