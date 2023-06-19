package dev.krud.boost.daemon.time

interface TimeService {
    /**
     * Get current time in milliseconds
     * @return current time in milliseconds
     */
    fun nowMillis(): Long
}