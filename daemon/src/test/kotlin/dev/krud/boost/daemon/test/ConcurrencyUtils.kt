package dev.krud.boost.daemon.test

import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

fun CountDownLatch.awaitOrThrow(timeout: Long, unit: TimeUnit) {
    if (!await(timeout, unit)) {
        throw IllegalStateException("Timeout waiting for latch")
    }
}