package dev.krud.boost.daemon.time

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isGreaterThan

class TimeServiceImplTest {
    @Test
    fun `nowMillis returns current time in milliseconds`() {
        val timeService = TimeServiceImpl()
        val currentMillis = System.currentTimeMillis()
        val now = timeService.nowMillis()
        expectThat(now).isGreaterThan(currentMillis - 1)
    }
}