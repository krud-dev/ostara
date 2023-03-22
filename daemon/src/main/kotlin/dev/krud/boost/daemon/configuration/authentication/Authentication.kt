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
    }

    data class Header(
        val headerName: String = "",
        val headerValue: String = ""
    ) : Authentication {
        override val type: String = "header"
        override val authenticator: Authenticator get() = HeaderAuthenticator(headerName, headerValue)
    }

    data class QueryString(
        val key: String = "",
        val value: String = ""
    ) : Authentication {
        override val type: String = "query-string"
        override val authenticator: Authenticator get() = QueryStringAuthenticator(key, value)
    }

    data class BearerToken(
        val token: String = ""
    ) : Authentication {
        override val type: String = "bearer"
        override val authenticator: Authenticator get() = BearerTokenAuthenticator(token)
    }
}