package dev.krud.boost.daemon.backup.migration

import com.fasterxml.jackson.databind.node.NumericNode
import org.springframework.stereotype.Component

@Component
class Version2BackupMigration : BackupMigration {
    override val toVersion = 2

    override fun migrate(input: BackupRootNode) {
        super.migrate(input)
        input.set<NumericNode>("date", input.numberNode(0))
    }
}