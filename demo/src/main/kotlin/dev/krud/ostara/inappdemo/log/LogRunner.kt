package dev.krud.ostara.inappdemo.log

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class LogRunner {

  @Scheduled(fixedDelay = 15000)
  fun run() {
    log.info { LogMessageConstructor.constructMessage() }
  }

  companion object {
    private val log = KotlinLogging.logger {}
  }
}
