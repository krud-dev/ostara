package dev.krud.boost.daemon.configuration.authentication

import java.util.*

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