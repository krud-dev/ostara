package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.threadprofiling.ThreadProfilingService
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingLogRO
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingRequestCreateRO
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingRequestRO
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/threadprofiling")
@Tag(name = "Thread Profiling", description = "Thread Profiling API")
class ThreadProfilingRequestController(
    private val threadProfilingService: ThreadProfilingService,
    private val shapeShift: ShapeShift,
    private val threadProfilingRequestKrud: Krud<ThreadProfilingRequest, UUID>
) : AbstractCrudController<ThreadProfilingRequest, ThreadProfilingRequestRO, ThreadProfilingRequestCreateRO, ThreadProfilingRequestRO>(ThreadProfilingRequest::class, ThreadProfilingRequestRO::class, shapeShift, threadProfilingRequestKrud) {

    @GetMapping("/{requestId}/log")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get thread logs for given profiling request Id",
        description = "Get thread logs for given profiling request Id"
    )
    @ApiResponse(responseCode = "200", description = "Returned Logs")
    @ApiResponse(responseCode = "404", description = "RequestId not found")
    fun getLogsForRequest(@PathVariable requestId: UUID): List<ThreadProfilingLogRO> {
        return shapeShift.mapCollection(threadProfilingService.getLogsForRequest(requestId))
    }
}