package dev.krud.boost.daemon.backup.migration

import com.fasterxml.jackson.databind.node.NumericNode
import com.fasterxml.jackson.databind.node.ObjectNode

typealias BackupRootNode = ObjectNode

interface BackupMigration {
    val toVersion: Int
    fun migrate(input: BackupRootNode) {
        input.version = toVersion
    }

    companion object {
        fun Collection<BackupMigration>.getForVersion(fromVersion: Int): List<BackupMigration> {
            return this.filter { it.toVersion > fromVersion }.sortedBy { it.toVersion }
        }

        fun Collection<BackupMigration>.getLatestVersion(): Int {
            if (this.isEmpty()) {
                return 0
            }
            return this.maxBy { it.toVersion }.toVersion
        }

        var BackupRootNode.version: Int
            get() = this.get("version").asInt()
            set(value) {
                this.set<NumericNode>("version", this.numberNode(value))
            }
    }
}

