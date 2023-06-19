package dev.krud.boost.daemon.agent.validation

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.crudframework.crud.handler.krud.Krud
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.stereotype.Component
import java.util.*
import kotlin.reflect.KClass

@Constraint(validatedBy = [AgentIdOrNullValidator::class])
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.FUNCTION, AnnotationTarget.PROPERTY_GETTER)
annotation class ValidAgentIdOrNull(val message: String = "Invalid agent ID", val groups: Array<KClass<*>> = [], val payload: Array<KClass<out Payload>> = [])

@Component
class AgentIdOrNullValidator(
    private val agentKrud: Krud<Agent, UUID>
) : ConstraintValidator<ValidAgentIdOrNull, UUID> {
    override fun isValid(value: UUID?, context: ConstraintValidatorContext?): Boolean {
        return value == null || agentKrud.showById(value) != null
    }
}