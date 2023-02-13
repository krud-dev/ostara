package dev.krud.boost.daemon.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

fun throwBadRequest(message: String): Nothing = throw ResponseStatusException(HttpStatus.BAD_REQUEST, message)

fun throwNotFound(message: String): Nothing = throw ResponseStatusException(HttpStatus.NOT_FOUND, message)

fun throwInternalServerError(message: String): Nothing = throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, message)