package dev.ostara.agent.service

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isContainedIn

class TimeServiceTest {
  @Test
  fun `currentTimeMillis should return the current time`() {
    val timeService = TimeService()
    val actualCurrentTimeMillis = System.currentTimeMillis()
    val currentTimeMillis = timeService.currentTimeMillis()
    expectThat(currentTimeMillis)
      .isContainedIn(actualCurrentTimeMillis - DEVIATION..actualCurrentTimeMillis + DEVIATION)
  }

  companion object {
    private const val DEVIATION = 100L
  }
}
