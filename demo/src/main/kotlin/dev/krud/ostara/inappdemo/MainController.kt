package dev.krud.ostara.inappdemo

import io.micrometer.core.instrument.Counter
import io.micrometer.core.instrument.MeterRegistry
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MainController(
  private val meterRegistry: MeterRegistry
) {
  @GetMapping
  fun getMain(): String {
    return "OK"
  }

  @GetMapping("/incrementTestMetric")
  fun incrementTestMetric(@RequestParam value: Double): String {
    Counter.builder("test.metric")
      .register(meterRegistry)
      .increment(value)

    return meterRegistry.counter("test.metric").count().toString()
  }
}
