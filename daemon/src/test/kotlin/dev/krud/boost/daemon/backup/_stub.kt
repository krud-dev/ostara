package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import java.util.*

fun stubBackupDTO(): BackupDTO {
    return BackupDTO(
        1,
        Date(),
        listOf(
            BackupDTO.TreeElement.Folder(
                model = BackupDTO.TreeElement.Folder.Model(
                    alias = "folder1",
                    description = "folder1",
                    color = DEFAULT_COLOR,
                    icon = null,
                    sort = 1.0,
                    authenticationProperties = mapOf("type" to "inherited")
                ),
                children = listOf(
                    BackupDTO.TreeElement.Application(
                        model = BackupDTO.TreeElement.Application.Model(
                            alias = "application1",
                            description = "application1",
                            color = DEFAULT_COLOR,
                            icon = null,
                            sort = 1.0,
                            authenticationProperties = mapOf("type" to "inherited")
                        ),
                        children = listOf(
                            BackupDTO.TreeElement.Application.Instance(
                                model = BackupDTO.TreeElement.Application.Instance.Model(
                                    alias = "instance1",
                                    description = "instance1",
                                    color = DEFAULT_COLOR,
                                    icon = null,
                                    sort = 1.0,
                                    actuatorUrl = "http://localhost:8080",
                                )
                            )
                        )
                    )
                )
            )
        )
    )
}