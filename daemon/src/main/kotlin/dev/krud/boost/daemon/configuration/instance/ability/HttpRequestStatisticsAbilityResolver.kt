package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Component

@Component
class HttpRequestStatisticsAbilityResolver : AbstractMetricsAbilityResolver(
  InstanceAbility.HTTP_REQUEST_STATISTICS,
  setOf(
    "http.server.requests"
  ),
  Mode.ALL
)
