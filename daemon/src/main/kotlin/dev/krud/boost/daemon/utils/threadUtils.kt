package dev.krud.boost.daemon.utils

import java.time.Duration
import java.util.concurrent.ExecutorService
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit

fun newLimitedCachedThreadPool(maximumPoolSize: Int, keepAliveTime: Duration = Duration.ofMinutes(1)): ExecutorService {
    return ThreadPoolExecutor(
        0,
        maximumPoolSize,
        keepAliveTime.toMillis(),
        TimeUnit.MILLISECONDS,
        LinkedBlockingQueue()
    )
}