package dev.krud.ostara.inappdemo.info

import org.springframework.boot.actuate.info.Info
import org.springframework.boot.actuate.info.InfoContributor
import org.springframework.stereotype.Component

@Component
class SampleInfoContributor : InfoContributor {
  override fun contribute(builder: Info.Builder) {
    builder.withDetails(
      mapOf(
        "someKey" to "someValue",
        "objectKey" to mapOf(
          "objectKey1" to "objectValue1",
          "objectKey2" to "objectValue2"
        )
      )
    )
  }
}
