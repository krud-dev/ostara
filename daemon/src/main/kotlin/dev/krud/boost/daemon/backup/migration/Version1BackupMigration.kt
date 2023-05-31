package dev.krud.boost.daemon.backup.migration

import com.fasterxml.jackson.databind.node.ObjectNode
import org.springframework.stereotype.Component

@Component
class Version1BackupMigration : BackupMigration {
    override val toVersion = 1

    override fun migrate(input: ObjectNode) {
        super.migrate(input)
    }
}