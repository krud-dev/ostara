package dev.krud.boost.daemon.backup.ro

import java.util.*

data class SystemBackupRO(
    val fileName: String,
    val date: Date,
    val valid: Boolean = true,
    val error: String? = null,
) {
    val auto = fileName.startsWith("backup-auto")
}