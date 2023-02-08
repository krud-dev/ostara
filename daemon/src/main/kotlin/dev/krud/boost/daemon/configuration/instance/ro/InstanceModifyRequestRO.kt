package dev.krud.boost.daemon.configuration.instance.ro

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(Instance::class)
data class InstanceModifyRequestRO(
    @MappedField
    @NotBlank
    val alias: String,
    @MappedField
    @NotBlank
    var actuatorUrl: String,
    @MappedField
    val dataCollectionIntervalSeconds: Int,
    @MappedField
    val description: String? = null,
    @MappedField
    val color: String? = null,
    @MappedField
    val icon: String? = null,
    @MappedField
    val sort: Int? = null,
    @MappedField
    val parentApplicationId: UUID? = null,
)