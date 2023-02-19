package dev.krud.boost.daemon.configuration.instance.ro

import dev.krud.boost.daemon.configuration.application.validation.ValidApplicationId
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(Instance::class)
data class InstanceModifyRequestRO(
    @MappedField
    @get:NotBlank
    val alias: String?,
    @MappedField
    @get:NotBlank
    var actuatorUrl: String,
    @MappedField
    val dataCollectionIntervalSeconds: Int,
    @MappedField
    @get:ValidApplicationId
    val parentApplicationId: UUID,
    @MappedField
    val color: String = DEFAULT_COLOR,
    @MappedField
    val description: String? = null,
    @MappedField
    val icon: String? = null,
    @MappedField
    val sort: Double? = null
)