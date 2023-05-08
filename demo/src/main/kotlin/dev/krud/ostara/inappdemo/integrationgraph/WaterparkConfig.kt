package dev.krud.ostara.inappdemo.integrationgraph

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.integration.dsl.IntegrationFlow
import org.springframework.integration.dsl.integrationFlow

@Configuration
class WaterparkConfig {

  @Bean
  fun waterparkFlow(): IntegrationFlow {
    return integrationFlow("slideEntranceChannel") {
      channel("inspectionAreaChannel")
    }
  }

  @Bean
  fun inspectionFlow() = integrationFlow("inspectionAreaChannel") {
    routeToRecipients {
      recipient("stagingAreaChannel") { _: Any -> true }
      recipient("failedInspectionChannel") { _: Any -> true }
    }
  }

  @Bean
  fun failedInspectionFlow() = integrationFlow("failedInspectionChannel") {
    channel("exitChannel")
  }

  @Bean
  fun stagingFlow() = integrationFlow("stagingAreaChannel") {
    split()
    channel("waterSlideChannel")
    aggregate()
    channel("poolChannel")
  }
}
