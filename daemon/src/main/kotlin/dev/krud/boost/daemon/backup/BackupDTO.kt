package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.boost.daemon.utils.TypeDefaults
import java.io.Serializable
import java.util.*


class BackupDTO(
    val version: Int? = null,
    val date: Date? = null,
    val tree: List<TreeElement>
) : Serializable {
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
    @JsonSubTypes(
        JsonSubTypes.Type(value = TreeElement.Folder::class, name = "folder"),
        JsonSubTypes.Type(value = TreeElement.Application::class, name = "application")
    )
    sealed interface TreeElement    {
        val type: String

        class Folder(
            val model: Model = Model(),
            var children: List<TreeElement> = emptyList()
        ) : TreeElement {
            override val type = "folder"

            data class Model(
                val alias: String = TypeDefaults.STRING,
                val description: String? = null,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val sort: Double? = null,
                val authenticationProperties: Map<String, String?>? = null
            )
        }

        class Application(
            val model: Model = Model(),
            var children: List<Instance> = emptyList(),
            var metricRules: List<MetricRule> = emptyList()
        ) : TreeElement {
            override val type = "application"

            data class Model(
                val alias: String = TypeDefaults.STRING,
                val description: String? = null,
                val type: String = ApplicationType.SPRING_BOOT.name,
                val color: String = DEFAULT_COLOR,
                val icon: String? = null,
                val sort: Double? = null,
                val authenticationProperties: Map<String, String?>? = null,
                val disableSslVerification: Boolean = false
            )

            class Instance(
                val model: Model = Model(),
            ) {
                val type = "instance"

                data class Model(
                    val alias: String? = null,
                    val actuatorUrl: String = TypeDefaults.STRING,
                    val description: String? = null,
                    val color: String = DEFAULT_COLOR,
                    val icon: String? = null,
                    val sort: Double? = null
                )
            }

            class MetricRule(
                val name: String = TypeDefaults.STRING,
                val metricName: String = TypeDefaults.STRING,
                val divisorMetricName: String? = null,
                val operation: String = TypeDefaults.STRING,
                val value1: Double = TypeDefaults.DOUBLE,
                val value2: Double? = null,
                val enabled: Boolean = TypeDefaults.BOOLEAN,
                val type: String = TypeDefaults.STRING,
            )
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
                    authenticationProperties = authentication.asMap(),
                ),
            )
        }

        fun TreeElement.Folder.toFolder(parentFolderId: UUID? = null): Folder {
            return Folder(
                alias = this.model.alias,
                description = this.model.description,
                color = this.model.color,
                icon = this.model.icon,
                sort = this.model.sort,
                authentication = Authentication.fromMap(this.model.authenticationProperties ?: emptyMap()),
            ).apply {
                this.parentFolderId = parentFolderId
            }
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
                    authenticationProperties = authentication.asMap(),
                    disableSslVerification = disableSslVerification
                ),
            )
        }

        fun TreeElement.Application.toApplication(parentFolderId: UUID? = null): Application {
            return Application(
                alias = this.model.alias,
                description = this.model.description,
                type = ApplicationType.valueOf(this.model.type),
                color = this.model.color,
                icon = this.model.icon,
                sort = this.model.sort,
                authentication = Authentication.fromMap(this.model.authenticationProperties ?: emptyMap()),
            ).apply {
                disableSslVerification = this@toApplication.model.disableSslVerification
                this.authentication = Authentication.fromMap(this@toApplication.model.authenticationProperties ?: emptyMap())
                this.parentFolderId = parentFolderId
            }
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

        fun TreeElement.Application.Instance.toInstance(parentApplicationId: UUID): Instance {
            return Instance(
                alias = this.model.alias,
                actuatorUrl = this.model.actuatorUrl,
                description = this.model.description,
                color = this.model.color,
                icon = this.model.icon,
                sort = this.model.sort,
                parentApplicationId = parentApplicationId
            )
        }

        fun ApplicationMetricRule.toTreeElement(): TreeElement.Application.MetricRule {
            return TreeElement.Application.MetricRule(
                name = name,
                metricName = metricName,
                divisorMetricName = divisorMetricName,
                operation = operation.toString(),
                value1 = value1,
                value2 = value2,
                enabled = enabled,
                type = type.toString()
            )
        }

        fun TreeElement.Application.MetricRule.toApplicationMetricRule(parentApplicationId: UUID): ApplicationMetricRule {
            return ApplicationMetricRule(
                name = name,
                metricName = metricName,
                divisorMetricName = divisorMetricName,
                operation = ApplicationMetricRuleOperation.valueOf(operation),
                value1 = value1,
                value2 = value2,
                enabled = enabled,
                type = ApplicationMetricRule.Type.valueOf(type),
                applicationId = parentApplicationId
            )
        }
    }
}