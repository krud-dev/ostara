package dev.krud.boost.daemon.utils

import dev.krud.boost.daemon.base.annotations.GenerateTypescript

@GenerateTypescript
data class ResultAggregationSummary<T>(
    /**
     * Total number of results
     */
    val totalCount: Int,
    /**
     * Number of successful results
     */
    val successCount: Int,
    /**
     * Number of failed results
     */
    val failureCount: Int,
    /**
     * List of error messages, ordered by the original order of results
     */
    val errors: List<String?>,
    /**
     * Map of exceptions and their frequency
     */
    private val exceptionsByFrequency: Map<Throwable, Int>
) {
    val status: Status
        get() = when {
            failureCount == 0 -> Status.SUCCESS
            successCount == 0 -> Status.FAILURE
            else -> Status.PARTIAL_SUCCESS
        }

    enum class Status {
        SUCCESS,
        PARTIAL_SUCCESS,
        FAILURE
    }

    companion object {
        fun <T> Collection<Result<T>>.aggregate(): ResultAggregationSummary<T> {
            val totalCount = this.size
            val successCount = this.count { it.isSuccess }
            val failureCount = this.count { it.isFailure }
            val errors = this.map {
                it.exceptionOrNull()?.message
            }
            val exceptionsByFrequency = this
                .filter { it.isFailure }.mapNotNull { it.exceptionOrNull() }
                .groupBy { it }
                .mapValues { it.value.size }
            return ResultAggregationSummary(totalCount, successCount, failureCount, errors, exceptionsByFrequency)
        }

        fun <T> ResultAggregationSummary<T>.throwIfFailure(): ResultAggregationSummary<T> {
            if (this.failureCount > 0) {
                this.exceptionsByFrequency
                    .maxByOrNull { it.value }
                    ?.key
                    ?.let { throw it }
                    ?: error("Unknown error")
            }
            return this
        }
    }
}