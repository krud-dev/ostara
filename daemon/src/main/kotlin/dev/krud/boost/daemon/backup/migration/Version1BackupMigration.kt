package dev.krud.boost.daemon.backup.migration

import org.springframework.stereotype.Component

@Component
class Version1BackupMigration : BackupMigration {
    override val toVersion = 1

    override fun migrate(input: BackupRootNode) {
        super.migrate(input)
    }
}