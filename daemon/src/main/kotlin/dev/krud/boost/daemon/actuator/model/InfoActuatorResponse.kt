package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import dev.krud.boost.daemon.actuator.jackson.GitDeserializer
import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class InfoActuatorResponse(
    val build: Build? = null,
    @JsonDeserialize(using = GitDeserializer::class)
    val git: Git? = null,
    val os: Os? = null,
    val java: Java? = null,
    @JsonAnySetter
    var extras: MutableMap<String, Any> = mutableMapOf()
) {
    data class Build(
        val artifact: String = TypeDefaults.STRING,
        val group: String = TypeDefaults.STRING,
        val name: String = TypeDefaults.STRING,
        val version: String = TypeDefaults.STRING,
        val time: ParsedDate? = null
    )

    sealed interface Git {
        val type: String?

        @GenerateTypescript
        object Unknown : Git {
            override val type: String = "unknown"
        }

        @GenerateTypescript
        data class Simple(
            val branch: String = TypeDefaults.STRING,
            val commit: Commit = Commit()
        ) : Git {
            override val type: String = "simple"

            data class Commit(
                val id: String = TypeDefaults.STRING,
                val time: ParsedDate? = null
            )
        }

        @GenerateTypescript
        data class Full(
            val branch: String = TypeDefaults.STRING,
            val commit: Commit = Commit(),
            val build: Build = Build(),
            val dirty: Boolean = TypeDefaults.BOOLEAN,
            val tags: String = TypeDefaults.STRING,
            val total: Total = Total(),
            val closest: Closest = Closest(),
            val remote: Remote = Remote()

        ) : Git {
            override val type: String = "full"

            data class Commit(
                val time: ParsedDate = TypeDefaults.PARSED_DATE,
                val message: Message = Message(),
                val id: Id = Id(),
                val user: User = User()
            ) {
                data class Message(
                    val full: String = TypeDefaults.STRING,
                    val short: String = TypeDefaults.STRING
                )

                data class Id(
                    val describe: String = TypeDefaults.STRING,
                    val abbrev: String = TypeDefaults.STRING,
                    val full: String = TypeDefaults.STRING
                )

                data class User(
                    val name: String = TypeDefaults.STRING,
                    val email: String = TypeDefaults.STRING
                )
            }

            data class Build(
                val version: String = TypeDefaults.STRING,
                val user: User = User(),
                val host: String = TypeDefaults.STRING
            ) {
                data class User(
                    val name: String = TypeDefaults.STRING,
                    val email: String = TypeDefaults.STRING
                )
            }

            data class Total(
                val commit: Commit = Commit()
            ) {
                data class Commit(
                    val count: String = TypeDefaults.STRING
                )
            }

            data class Closest(
                val tag: Tag = Tag()
            ) {
                data class Tag(
                    val commit: Commit = Commit(),
                    val name: String = TypeDefaults.STRING
                ) {
                    data class Commit(
                        val count: String = TypeDefaults.STRING
                    )
                }
            }

            data class Remote(
                val origin: Origin = Origin()
            ) {
                data class Origin(
                    val url: String = TypeDefaults.STRING
                )
            }
        }
    }

    data class Os(
        val name: String = TypeDefaults.STRING,
        val arch: String = TypeDefaults.STRING,
        val version: String = TypeDefaults.STRING
    )

    data class Java(
        val version: String = TypeDefaults.STRING,
        val vendor: Vendor = Vendor(),
        val runtime: Runtime = Runtime(),
        val jvm: Jvm = Jvm()
    ) {
        data class Vendor(
            val name: String = TypeDefaults.STRING,
            val version: String = TypeDefaults.STRING
        )

        data class Runtime(
            val name: String = TypeDefaults.STRING,
            val version: String = TypeDefaults.STRING
        )

        data class Jvm(
            val name: String = TypeDefaults.STRING,
            val version: String = TypeDefaults.STRING,
            val vendor: String = TypeDefaults.STRING
        )
    }
}