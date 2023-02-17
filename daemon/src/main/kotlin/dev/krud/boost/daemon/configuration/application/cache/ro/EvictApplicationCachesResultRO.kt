package dev.krud.boost.daemon.configuration.application.cache.ro

import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.boost.daemon.utils.ResultAggregationSummary.Companion.concat
import java.util.UUID

class EvictApplicationCachesResultRO(
    val summaries: Map<UUID, ResultAggregationSummary<Unit>>
) {
    val status: ResultAggregationSummary.Status = summaries.values.concat().status
}