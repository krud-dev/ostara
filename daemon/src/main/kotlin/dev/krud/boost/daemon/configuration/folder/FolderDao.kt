package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface FolderDao : JpaRepository<Folder, UUID>
