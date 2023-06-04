package dev.krud.boost.daemon.configuration.authentication

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeId
import com.fasterxml.jackson.annotation.JsonTypeInfo
import dev.krud.boost.daemon.actuator.authenticator.BasicAuthenticator
import dev.krud.boost.daemon.actuator.authenticator.BearerTokenAuthenticator
import dev.krud.boost.daemon.actuator.authenticator.HeaderAuthenticator
import dev.krud.boost.daemon.actuator.authenticator.QueryStringAuthenticator
import okhttp3.Authenticator

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = Authentication.None::class, name = "none"),
    JsonSubTypes.Type(value = Authentication.Inherit::class, name = "inherit"),
    JsonSubTypes.Type(value = Authentication.Basic::class, name = "basic"),
    JsonSubTypes.Type(value = Authentication.Header::class, name = "header"),
    JsonSubTypes.Type(value = Authentication.QueryString::class, name = "query-string"),
    JsonSubTypes.Type(value = Authentication.BearerToken::class, name = "bearer-token")
)
sealed interface Authentication {
    @get:JsonTypeId
    val type: String

    @get:JsonIgnore
    val authenticator: Authenticator get() = Authenticator.NONE

    fun asMap(): Map<String, String?> = mapOf("type" to type)

    class Inherit : Authentication {
        override val type: String = "inherit"

        companion object {
            val DEFAULT = Inherit()
        }
    }

    class None : Authentication {
        override val type: String = "none"

        companion object {
            val DEFAULT = None()
        }
    }

    data class Basic(
        val username: String = "",
        val password: String = ""
    ) : Authentication {
        override val type: String = "basic"
        override val authenticator: Authenticator get() = BasicAuthenticator(username, password)
        override fun asMap(): Map<String, String?> {
            return super.asMap() + mapOf(
                "username" to username,
                "password" to password
            )
        }
    }

    data class Header(
        val headerName: String = "",
        val headerValue: String = ""
    ) : Authentication {
        override val type: String = "header"
        override val authenticator: Authenticator get() = HeaderAuthenticator(headerName, headerValue)
        override fun asMap(): Map<String, String?> {
            return super.asMap() + mapOf(
                "headerName" to headerName,
                "headerValue" to headerValue
            )
        }
    }

    data class QueryString(
        val key: String = "",
        val value: String = ""
    ) : Authentication {
        override val type: String = "query-string"
        override val authenticator: Authenticator get() = QueryStringAuthenticator(key, value)
        override fun asMap(): Map<String, String?> {
            return super.asMap() + mapOf(
                "key" to key,
                "value" to value
            )
        }
    }

    data class BearerToken(
        val token: String = ""
    ) : Authentication {
        override val type: String = "bearer-token"
        override val authenticator: Authenticator get() = BearerTokenAuthenticator(token)
        override fun asMap(): Map<String, String?> {
            return super.asMap() + mapOf(
                "token" to token
            )
        }
    }

    companion object {
        fun fromMap(map: Map<String, String?>): Authentication {
            val type = map["type"]
            return when (type) {
                "none" -> None()
                "inherit" -> Inherit()
                "basic" -> Basic(
                    username = map["username"] ?: "",
                    password = map["password"] ?: ""
                )
                "header" -> Header(
                    headerName = map["headerName"] ?: "",
                    headerValue = map["headerValue"] ?: ""
                )
                "query-string" -> QueryString(
                    key = map["key"] ?: "",
                    value = map["value"] ?: ""
                )
                "bearer-token" -> BearerToken(
                    token = map["token"] ?: ""
                )
                else -> None()
            }
        }
    }
}