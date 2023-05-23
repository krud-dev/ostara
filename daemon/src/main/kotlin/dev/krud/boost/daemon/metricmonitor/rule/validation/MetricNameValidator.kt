package dev.krud.boost.daemon.metricmonitor.rule.validation

import dev.krud.boost.daemon.utils.ParsedMetricName
import io.github.oshai.KotlinLogging
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.stereotype.Component
import java.util.*
import kotlin.reflect.KClass

@Constraint(validatedBy = [MetricNameValidator::class])
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.FUNCTION, AnnotationTarget.PROPERTY_GETTER)
annotation class ValidMetricName(val message: String = "Invalid metric name", val groups: Array<KClass<*>> = [], val payload: Array<KClass<out Payload>> = [])

@Component
class MetricNameValidator : ConstraintValidator<ValidMetricName, UUID> {

    override fun isValid(value: UUID?, context: ConstraintValidatorContext?): Boolean {
        log.debug { "Validating metric name $value" }
        ParsedMetricName.from(value.toString())
        return true
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}