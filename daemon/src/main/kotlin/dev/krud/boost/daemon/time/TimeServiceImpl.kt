package dev.krud.boost.daemon.time

import org.springframework.stereotype.Service

@Service
class TimeServiceImpl : TimeService {
    override fun nowMillis(): Long {
        return System.currentTimeMillis()
    }
}