package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(Application::class)
data class ApplicationModifyRequestRO(
    @MappedField
    @NotBlank
    val alias: String,
    @MappedField
    val type: ApplicationType,
    @MappedField
    val color: String = DEFAULT_COLOR,
    @MappedField
    val description: String? = null,
    @MappedField
    val icon: String? = null,
    @MappedField
    val sort: Int? = null,
    @MappedField
    val parentFolderId: UUID? = null
)