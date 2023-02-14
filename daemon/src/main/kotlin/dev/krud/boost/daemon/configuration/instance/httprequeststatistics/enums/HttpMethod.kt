package dev.krud.boost.daemon.configuration.instance.httprequeststatistics.enums

import dev.krud.boost.daemon.base.annotations.GenerateTypescript

@GenerateTypescript
enum class HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    OPTIONS,
    TRACE
}