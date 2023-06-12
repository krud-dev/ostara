package dev.krud.boost.daemon.actuator.jackson

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.jackson.MultiDateParsingModule
import org.intellij.lang.annotations.Language
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import java.io.ByteArrayInputStream

class GitDeserializerTest {
    private val objectMapper = jacksonObjectMapper().registerModule(
        MultiDateParsingModule()
    )

    @Language("JSON")
    private val fullJson = """
        {
            "branch": "master",
            "commit": {
                "time": 1686481589,
                "message": {
                    "full": "Add resolver tests\n",
                    "short": "Add resolver tests"
                },
                "id": {
                    "describe": "v0.9.0-64-g545b6f6-dirty",
                    "abbrev": "545b6f6",
                    "full": "545b6f68d67937fd6ddc87017439cae0a9430262"
                },
                "user": {
                    "email": "some@user.com",
                    "name": "Some User"
                }
            },
            "build": {
                "version": "0.0.1-SNAPSHOT",
                "user": {
                    "name": "Some User",
                    "email": "some@user.com"
                },
                "host": "some-host"
            },
            "dirty": "true",
            "tags": "",
            "total": {
                "commit": {
                    "count": "820"
                }
            },
            "closest": {
                "tag": {
                    "commit": {
                        "count": "64"
                    },
                    "name": "v0.9.0"
                }
            },
            "remote": {
                "origin": {
                    "url": "git@github.com:krud-dev/ostara.git"
                }
            }
        }
    """.trimIndent()

    @Language("JSON")
    private val fullJsonWithType = """
        {
            "type": "full",
            "branch": "master",
            "commit": {
                "time": 1686481589000,
                "message": {
                    "full": "Add resolver tests\n",
                    "short": "Add resolver tests"
                },
                "id": {
                    "describe": "v0.9.0-64-g545b6f6-dirty",
                    "abbrev": "545b6f6",
                    "full": "545b6f68d67937fd6ddc87017439cae0a9430262"
                },
                "user": {
                    "email": "some@user.com",
                    "name": "Some User"
                }
            },
            "build": {
                "version": "0.0.1-SNAPSHOT",
                "user": {
                    "name": "Some User",
                    "email": "some@user.com"
                },
                "host": "some-host"
            },
            "dirty": "true",
            "tags": "",
            "total": {
                "commit": {
                    "count": "820"
                }
            },
            "closest": {
                "tag": {
                    "commit": {
                        "count": "64"
                    },
                    "name": "v0.9.0"
                }
            },
            "remote": {
                "origin": {
                    "url": "git@github.com:krud-dev/ostara.git"
                }
            }
        }
    """.trimIndent()

    @Language("JSON")
    private val simpleJson = """
        {
            "branch": "develop",
            "commit": {
              "id": "123456",
              "time": 1672061382
            }
        }
    """.trimIndent()

    @Language("JSON")
    private val simpleJsonWithType = """
        {
            "type": "simple",
            "branch": "develop",
            "commit": {
              "id": "123456",
              "time": 1672061382
            }
        }
    """.trimIndent()

    @Language("JSON")
    private val simpleJsonWithInvalidMarker = """
        {
            "branch": "develop",
            "commit": {
              "id": [1,2,3,4],
              "time": 1672061382
            }
        }
    """.trimIndent()

    @Test
    fun `deserialize should return unknown type if tree has no type and no markers`() {
        val json = """
            {}
        """.trimIndent()
        val stream = ByteArrayInputStream(json.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val result = deserializer.deserialize(parser, context)
        expectThat(result).isA<InfoActuatorResponse.Git.Unknown>()
    }

    @Test
    fun `deserialize should return unknown if tree has unknown type`() {
        val json = """
            {
                "type": "some_type"
            }
        """.trimIndent()
        val stream = ByteArrayInputStream(json.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val result = deserializer.deserialize(parser, context)
        expectThat(result).isA<InfoActuatorResponse.Git.Unknown>()
    }

    @Test
    fun `deserialize should return unknown if marker is invalid`() {
        val stream = ByteArrayInputStream(simpleJsonWithInvalidMarker.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val result = deserializer.deserialize(parser, context)
        expectThat(result).isA<InfoActuatorResponse.Git.Unknown>()
    }

    @Test
    fun `deserialize should deserialize simple if type is found`() {
        val stream = ByteArrayInputStream(simpleJsonWithType.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val git = deserializer.deserialize(parser, context)
        expectThat(git).isA<InfoActuatorResponse.Git.Simple>()
            .and {
                get { branch }.isEqualTo("develop")
                get { commit.id }.isEqualTo("123456")
                get { commit.time?.date?.time }.isEqualTo(1672061382000)
            }
    }

    @Test
    fun `deserialize should deserialize simple if marker is found`() {
        val stream = ByteArrayInputStream(simpleJson.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val git = deserializer.deserialize(parser, context)
        expectThat(git).isA<InfoActuatorResponse.Git.Simple>()
            .and {
                get { branch }.isEqualTo("develop")
                get { commit.id }.isEqualTo("123456")
                get { commit.time?.date?.time }.isEqualTo(1672061382000)
            }
    }

    @Test
    fun `deserialize should deserialize full if type is found`() {
        val stream = ByteArrayInputStream(fullJsonWithType.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val git = deserializer.deserialize(parser, context)
        git.runFullAssertions()
    }

    @Test
    fun `deserialize should deserialize full if marker is found`() {
        val stream = ByteArrayInputStream(fullJson.toByteArray(Charsets.UTF_8))
        val parser = objectMapper.factory.createParser(stream)
        val context = objectMapper.deserializationContext
        val deserializer = GitDeserializer()
        val git = deserializer.deserialize(parser, context)
        git.runFullAssertions()

    }

    private fun InfoActuatorResponse.Git?.runFullAssertions() {
        expectThat(this).isA<InfoActuatorResponse.Git.Full>()
            .and {
                get { branch }.isEqualTo("master")
                get { commit.id.describe }.isEqualTo("v0.9.0-64-g545b6f6-dirty")
                get { commit.id.abbrev }.isEqualTo("545b6f6")
                get { commit.id.full }.isEqualTo("545b6f68d67937fd6ddc87017439cae0a9430262")
                get { commit.time.date?.time }.isEqualTo(1686481589000)
                get { commit.message.full }.isEqualTo("Add resolver tests\n")
                get { commit.message.short }.isEqualTo("Add resolver tests")
                get { commit.user.email }.isEqualTo("some@user.com")
                get { commit.user.name }.isEqualTo("Some User")
                get { build.version }.isEqualTo("0.0.1-SNAPSHOT")
                get { build.user.name }.isEqualTo("Some User")
                get { build.user.email }.isEqualTo("some@user.com")
                get { build.host }.isEqualTo("some-host")
                get { dirty }.isEqualTo(true)
                get { tags }.isEqualTo("")
                get { total.commit.count }.isEqualTo("820")
                get { closest.tag.commit.count }.isEqualTo("64")
                get { closest.tag.name }.isEqualTo("v0.9.0")
                get { remote.origin.url }.isEqualTo("git@github.com:krud-dev/ostara.git")
            }
    }
}