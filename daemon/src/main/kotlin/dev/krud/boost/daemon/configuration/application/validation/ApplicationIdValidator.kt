package dev.krud.boost.daemon.configuration.application.validation

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.crudframework.crud.handler.CrudHandler
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.stereotype.Component
import java.util.*
import kotlin.reflect.KClass

@Constraint(validatedBy = [ApplicationIdValidator::class])
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.FUNCTION, AnnotationTarget.PROPERTY_GETTER)
annotation class ValidApplicationId(val message: String = "Invalid application ID", val groups: Array<KClass<*>> = [], val payload: Array<KClass<out Payload>> = [])

@Component
class ApplicationIdValidator(
    private val crudHandler: CrudHandler
) : ConstraintValidator<ValidApplicationId, UUID> {

    override fun isValid(value: UUID?, context: ConstraintValidatorContext?): Boolean {
        return value != null && crudHandler.show(value, Application::class.java)
            .execute() != null // TODO: we should do a count query instead of a full select
    }
}