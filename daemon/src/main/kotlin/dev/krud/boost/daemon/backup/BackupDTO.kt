package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
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
            val children: List<TreeElement>
        ) : TreeElement {
            override val type = "folder"

            data class Model(
                val alias: String,
                val description: String? = null,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val authentication: String? = null, // TODO
            )
        }

        class Application(
            val model: Model,
            val children: List<Instance>
        ) : TreeElement {
            override val type = "application"

            data class Model(
                val alias: String,
                val description: String? = null,
                val type: String,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val sort: String? = null,
                val authentication: String? = null,
                val disableSslVerification: Boolean? = null
            )

            class Instance(
                val model: Model,
            ) {
                val type = "instance"

                data class Model(
                    val alias: String,
                    val actuatorUrl: String,
                    val description: String? = null,
                    val color: String = DEFAULT_COLOR,
                    val icon: String? = null,
                    val sort: String? = null,
                    val hostname: String? = null
                )
            }
        }
    }
}