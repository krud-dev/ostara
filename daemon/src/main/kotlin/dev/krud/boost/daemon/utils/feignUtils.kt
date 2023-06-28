package dev.krud.boost.daemon.utils

import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.exception.throwServiceUnavailable
import dev.krud.boost.daemon.exception.throwStatusCode

fun <T> runFeignCatching(block: () -> T): Result<T> = runCatching {
    block()
}
    .recoverCatching {
        when (it) {
            is feign.RetryableException -> throwServiceUnavailable("Agent is not available")
            is feign.FeignException -> throwStatusCode(it.status(), it.contentUTF8())
            else -> throwInternalServerError(it.message)
        }
    }