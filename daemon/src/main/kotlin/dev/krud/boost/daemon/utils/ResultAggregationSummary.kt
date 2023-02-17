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
    val errors: List<String?>
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
        val Collection<ResultAggregationSummary<*>>.aggregateErrors: List<String>
            get() {
                val errors = this.map { it.errors }
                val maxErrors = errors.maxOf { it.size }
                return (0 until maxErrors).map { index ->
                    errors.map { it.getOrNull(index) }.joinToString(", ")
                }
            }

        fun <T> Collection<Result<T>>.aggregate(): ResultAggregationSummary<T> {
            val totalCount = this.size
            val successCount = this.count { it.isSuccess }
            val failureCount = this.count { it.isFailure }
            val errors = this.map {
                it.exceptionOrNull()?.message
            }
            return ResultAggregationSummary(totalCount, successCount, failureCount, errors)
        }

        fun <T> Collection<ResultAggregationSummary<T>>.concat(): ResultAggregationSummary<T> {
            if (this.isEmpty()) {
                return ResultAggregationSummary(0, 0, 0, emptyList())
            }

            val totalCount = this.sumOf { it.totalCount }
            val successCount = this.sumOf { it.successCount }
            val failureCount = this.sumOf { it.failureCount }
            val errors = this.flatMap { it.errors }

            return ResultAggregationSummary(totalCount, successCount, failureCount, errors)
        }
    }
}