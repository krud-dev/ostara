package dev.krud.boost.daemon.configuration.authentication

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import java.util.*

@GenerateTypescript
data class EffectiveAuthentication(
    val authentication: Authentication,
    val sourceType: SourceType,
    val sourceId: UUID
) {
    enum class SourceType {
        FOLDER,
        APPLICATION
    }
}