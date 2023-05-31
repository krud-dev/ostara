package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.utils.DEFAULT_COLOR


class BackupDTO(
    val version: Int? = null,
    val tree: List<TreeElement>
) {
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
    @JsonSubTypes(
        JsonSubTypes.Type(value = TreeElement.Folder::class, name = "folder"),
        JsonSubTypes.Type(value = TreeElement.Application::class, name = "application")
    )
    sealed interface TreeElement {
        val type: String

        class Folder(
            val model: Model,
            var children: List<TreeElement> = emptyList()
        ) : TreeElement {
            override val type = "folder"

            data class Model(
                val alias: String,
                val description: String? = null,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val sort: Double? = null,
                val authentication: String? = null, // TODO
            )
        }

        class Application(
            val model: Model,
            var children: List<Instance> = emptyList()
        ) : TreeElement {
            override val type = "application"

            data class Model(
                val alias: String,
                val description: String? = null,
                val type: String,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val sort: Double? = null,
                val authentication: String? = null,
                val disableSslVerification: Boolean? = null
            )

            class Instance(
                val model: Model,
            ) {
                val type = "instance"

                data class Model(
                    val alias: String?,
                    val actuatorUrl: String,
                    val description: String? = null,
                    val color: String = DEFAULT_COLOR,
                    val icon: String? = null,
                    val sort: Double? = null
                )
            }
        }
    }

    companion object {
        fun Folder.toTreeElement(): TreeElement.Folder {
            return TreeElement.Folder(
                model = TreeElement.Folder.Model(
                    alias = alias,
                    description = description,
                    color = color,
                    icon = icon,
                    authentication = authentication.type
                ),
            )
        }

        fun Application.toTreeElement(): TreeElement.Application {
            return TreeElement.Application(
                model = TreeElement.Application.Model(
                    alias = alias,
                    description = description,
                    type = type.toString(),
                    color = color,
                    icon = icon,
                    sort = sort,
                    authentication = authentication.type,
                    disableSslVerification = disableSslVerification
                ),
            )
        }

        fun Instance.toTreeElement(): TreeElement.Application.Instance {
            return TreeElement.Application.Instance(
                model = TreeElement.Application.Instance.Model(
                    alias = alias,
                    actuatorUrl = actuatorUrl,
                    description = description,
                    color = color,
                    icon = icon,
                    sort = sort
                ),
            )
        }
    }
}