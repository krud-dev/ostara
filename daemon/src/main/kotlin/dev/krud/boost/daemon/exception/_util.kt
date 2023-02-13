package dev.krud.boost.daemon.exception

import org.springframework.http.HttpStatus
import org.springframework.web.client.HttpClientErrorException

fun throwBadRequest(message: String): Nothing = throw HttpClientErrorException(HttpStatus.BAD_REQUEST, message)

fun throwNotFound(message: String): Nothing = throw HttpClientErrorException(HttpStatus.NOT_FOUND, message)

fun throwInternalServerError(message: String): Nothing = throw HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, message)