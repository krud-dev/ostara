package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.kotlinModule
import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.backup.migration.BackupMigration.Companion.getForVersion
import dev.krud.boost.daemon.backup.migration.BackupMigration.Companion.getLatestVersion
import io.github.oshai.KotlinLogging
import org.springframework.stereotype.Component

@Component
class BackupParser(
    private val backupMigrations: List<BackupMigration>
) {
    private val latestVersion = backupMigrations.getLatestVersion()

    internal val objectMapper = ObjectMapper().apply {
        registerModule(kotlinModule())
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    }

    fun parse(input: String): BackupDTO {
        val json = objectMapper.readTree(input)
        return parse(json)
    }

    fun parse(json: JsonNode): BackupDTO {
        if (!json.isObject) {
            error("Invalid backup format")
        }
        val version = json.getVersion()
        log.info { "Parsing backup..." }
        log.trace {
            json.toPrettyString()
        }

        if (version != latestVersion) {
            val migrationsToRun = backupMigrations.getForVersion(version)
            if (migrationsToRun.isNotEmpty()) {
                log.info { "Out of date backup format detected (version ${version}), upgrading backup to version ${migrationsToRun.maxBy { it.toVersion }}..." }
                migrationsToRun.forEach {
                    log.debug { "Running migration ${it::class.simpleName} to version ${it.toVersion}" }
                    val result = runCatching {
                        it.migrate(json as ObjectNode)
                    }
                    if (result.isFailure) {
                        log.error(result.exceptionOrNull()) { "Failed to run migrate backup format to version ${it.toVersion}" }
                        error("Failed to run migrate backup format to version ${it.toVersion}: ${result.exceptionOrNull()?.message}")
                    }
                }
            } else {
                log.error { "Backup format version $version is not supported" }
                error("Backup format version $version is not supported")
            }
        } else {
            log.info { "Backup format is up to date" }
        }

        val dto = objectMapper.convertValue(json, BackupDTO::class.java)
        // TODO: validate
        return dto
    }

    private fun JsonNode.getVersion(): Int {
        if (!this.has("version")) {
            error("Missing version")
        }
        val version = this["version"].asInt()
        if (version > latestVersion) {
            error("Backup format version $version is not supported")
        }
        return version
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}

fun main() {
    val json = """
        {
            "version": 1,
            "deprecatedField": false,
            "tree": [
                {
                    "model": {
                        "alias": "rootFolder1",
                        "description": null,
                        "color": "inherited",
                        "icon": null,
                        "sort": null,
                        "authentication": "inherit"
                    },
                    "children": [
                        {
                            "model": {
                                "alias": "rootFolder1_1",
                                "description": null,
                                "color": "inherited",
                                "icon": null,
                                "sort": null,
                                "authentication": "inherit"
                            },
                            "children": [],
                            "type": "folder"
                        },
                        {
                            "model": {
                                "alias": "rootFolder1_2",
                                "description": null,
                                "color": "inherited",
                                "icon": null,
                                "sort": null,
                                "authentication": "inherit"
                            },
                            "children": [],
                            "type": "folder"
                        },
                        {
                            "model": {
                                "alias": "rootFolder1Application1",
                                "description": null,
                                "type": "SPRING_BOOT",
                                "color": "inherited",
                                "icon": null,
                                "sort": null,
                                "authentication": "inherit",
                                "disableSslVerification": false
                            },
                            "children": [
                                {
                                    "model": {
                                        "alias": "rootFolder1ApplicationInstance1",
                                        "actuatorUrl": "http://example.com/actuator",
                                        "description": null,
                                        "color": "inherited",
                                        "icon": null,
                                        "sort": null
                                    },
                                    "type": "instance"
                                },
                                {
                                    "model": {
                                        "alias": "rootFolder1ApplicationInstance2",
                                        "actuatorUrl": "http://example.com/actuator",
                                        "description": null,
                                        "color": "inherited",
                                        "icon": null,
                                        "sort": null
                                    },
                                    "type": "instance"
                                }
                            ],
                            "type": "application"
                        }
                    ],
                    "type": "folder"
                },
                {
                    "model": {
                        "alias": "rootApplication1",
                        "description": null,
                        "type": "SPRING_BOOT",
                        "color": "inherited",
                        "icon": null,
                        "sort": null,
                        "authentication": "inherit",
                        "disableSslVerification": false
                    },
                    "children": [
                        {
                            "model": {
                                "alias": "rootApplicationInstance1",
                                "actuatorUrl": "http://example.com/actuator",
                                "description": null,
                                "color": "inherited",
                                "icon": null,
                                "sort": null
                            },
                            "type": "instance"
                        },
                        {
                            "model": {
                                "alias": "rootApplicationInstance2",
                                "actuatorUrl": "http://example.com/actuator",
                                "description": null,
                                "color": "inherited",
                                "icon": null,
                                "sort": null
                            },
                            "type": "instance"
                        }
                    ],
                    "type": "application"
                }
            ]
        }
    """.trimIndent()

    val backupParser = BackupParser(listOf(
        object : BackupMigration {
            override val toVersion: Int = 5
            override fun migrate(input: ObjectNode) {
                super.migrate(input)
            }
        },
        object : BackupMigration {
            override val toVersion: Int = 6
            override fun migrate(input: ObjectNode) {
                super.migrate(input)
                input.remove("deprecatedField")
            }
        },
    ))
    val backupDTO = backupParser.parse(json)
    println(backupDTO)
}