package dev.krud.boost.daemon.exception

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

fun throwBadRequest(message: String?): Nothing = throwStatus(HttpStatus.BAD_REQUEST, message)

fun throwNotFound(message: String?): Nothing = throwStatus(HttpStatus.NOT_FOUND, message)

fun throwInternalServerError(message: String?): Nothing = throwStatus(HttpStatus.INTERNAL_SERVER_ERROR, message)

fun throwServiceUnavailable(message: String?): Nothing = throwStatus(HttpStatus.SERVICE_UNAVAILABLE, message)

fun throwUnauthorized(message: String?): Nothing = throwStatus(HttpStatus.UNAUTHORIZED, message)

fun throwForbidden(message: String?): Nothing = throwStatus(HttpStatus.FORBIDDEN, message)

fun throwStatusCode(statusCode: Int, message: String?): Nothing = throwStatus(HttpStatus.valueOf(statusCode), message)

fun throwStatus(status: HttpStatus, message: String?): Nothing = throw ResponseStatusException(status, message)
