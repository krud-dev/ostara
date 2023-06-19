package dev.krud.boost.daemon.agent.ro

import com.fasterxml.jackson.annotation.JsonIgnore
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.AssertTrue
import jakarta.validation.constraints.NotBlank
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import org.hibernate.validator.constraints.URL

@DefaultMappingTarget(Agent::class)
class AgentModifyRequestRO(
    @MappedField
    @field:NotBlank
    val name: String,
    @MappedField
    @field:NotBlank
    @field:URL
    val url: String,
    @MappedField
    var apiKey: String?
) {
    @JsonIgnore
    @AssertTrue(message = "API key should not be supplied for HTTP URLs")
    fun isApiKeySuppliedWithHttpUrl(): Boolean {
        val url = url.toHttpUrlOrNull() ?: return false
        if (!apiKey.isNullOrBlank()) {
            return url.scheme != "http"
        }
        return true
    }

    @JsonIgnore
    @AssertTrue(message = "API key should be supplied for HTTPs URLs")
    fun isApiKeySuppliedWithHttpsUrl(): Boolean {
        val url = url.toHttpUrlOrNull() ?: return false
        if (apiKey.isNullOrBlank()) {
            return url.scheme != "https"
        }
        return true
    }
}
