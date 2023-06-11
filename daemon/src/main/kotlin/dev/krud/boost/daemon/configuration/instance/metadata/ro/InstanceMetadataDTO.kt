package dev.krud.boost.daemon.configuration.instance.metadata.ro

import java.util.Date
class InstanceMetadataDTO(
    val version: String? = null,
    val buildTime: Date? = null,
    val gitCommitId: String? = null,
    val gitBranch: String? = null,
) {
    companion object {
        val EMPTY = InstanceMetadataDTO()
    }
}