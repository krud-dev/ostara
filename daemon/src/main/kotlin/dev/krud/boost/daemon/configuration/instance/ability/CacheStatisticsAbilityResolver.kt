package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Component

@Component
class CacheStatisticsAbilityResolver : AbstractMetricsAbilityResolver(
  InstanceAbility.CACHE_STATISTICS,
  setOf(
    "cache.gets",
    "cache.puts",
    "cache.evictions",
    "cache.hits",
    "cache.misses",
    "cache.removals",
    "cache.size"
  ),
  Mode.ANY
)
