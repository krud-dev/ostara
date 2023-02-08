package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import dev.krud.crudframework.crud.handler.CrudHandler
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.springframework.boot.logging.LogLevel
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("$API_PREFIX/actuator")
class ActuatorController(
    private val crudHandler: CrudHandler
) {
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get actuator endpoints",
        description = "Equivalent call to actuator root /",
    )
    @ApiResponse(responseCode = "200", description = "List of actuator endpoints")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun endpoints(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).endpoints()

    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get health status",
        description = "Equivalent call to actuator health /health",
    )
    @ApiResponse(responseCode = "200", description = "Health object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun health(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).health()

    @GetMapping("/health/{component}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get health status of a component",
        description = "Equivalent call to actuator health /health/{component}",
    )
    @ApiResponse(responseCode = "200", description = "Health object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun healthComponent(@RequestParam instanceId: UUID, @PathVariable component: String) = getActuatorClient(instanceId).healthComponent(component)

    @GetMapping("/info")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get info",
        description = "Equivalent call to actuator info /info",
    )
    @ApiResponse(responseCode = "200", description = "Info object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun info(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).info()

    @GetMapping("/caches")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get caches",
        description = "Equivalent call to actuator caches /caches",
    )
    @ApiResponse(responseCode = "200", description = "Caches list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun caches(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).caches()

    @GetMapping("/caches/{cache}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific cache",
        description = "Equivalent call to actuator caches /caches/{cache}",
    )
    @ApiResponse(responseCode = "200", description = "Cache object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun cache(@RequestParam instanceId: UUID, @PathVariable cache: String) = getActuatorClient(instanceId).cache(cache)

    @DeleteMapping("/caches")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict all caches",
        description = "Equivalent call to actuator DELETE /caches",
    )
    @ApiResponse(responseCode = "204", description = "Caches cleared")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun evictAllCaches(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).evictAllCaches()

    @DeleteMapping("/caches/{cache}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict specific cache",
        description = "Equivalent call to actuator DELETE /caches/{cache}",
    )
    @ApiResponse(responseCode = "204", description = "Cache cleared")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun evictCache(@RequestParam instanceId: UUID, @PathVariable cache: String) = getActuatorClient(instanceId).evictCache(cache)

    @GetMapping("/beans")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get beans",
        description = "Equivalent call to actuator beans /beans",
    )
    @ApiResponse(responseCode = "200", description = "Beans list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun beans(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).beans()

    @GetMapping("/logfile")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get logfile",
        description = "Equivalent call to actuator logfile /logfile",
    )
    @ApiResponse(responseCode = "200", description = "Logfile content")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun logfile(@RequestParam instanceId: UUID, @RequestParam(required = false) start: Long?, @RequestParam(required = false) end: Long?) = getActuatorClient(instanceId).logfile(start, end)

    @GetMapping("/metrics")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get metrics",
        description = "Equivalent call to actuator metrics /metrics",
    )
    @ApiResponse(responseCode = "200", description = "Metrics list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun metrics(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).metrics()

    @GetMapping("/metrics/{metric}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific metric",
        description = "Equivalent call to actuator metrics /metrics/{metric}",
    )
    @ApiResponse(responseCode = "200", description = "Metric object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun metric(@RequestParam instanceId: UUID, @PathVariable metric: String, @RequestBody(required = false) tags: Map<String, String>?) = getActuatorClient(instanceId).metric(metric, tags ?: emptyMap())

    @GetMapping("/shutdown")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Shutdown the application",
        description = "Equivalent call to actuator shutdown /shutdown",
    )
    @ApiResponse(responseCode = "200", description = "Shutdown successful")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun shutdown(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).shutdown()

    @GetMapping("/env")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get environment",
        description = "Equivalent call to actuator env /env",
    )
    @ApiResponse(responseCode = "200", description = "Environment object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun env(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).env()

    @GetMapping("/env/{property}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific environment property",
        description = "Equivalent call to actuator env /env/{property}",
    )
    @ApiResponse(responseCode = "200", description = "Environment property object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun envProperty(@RequestParam instanceId: UUID, @PathVariable property: String) = getActuatorClient(instanceId).envProperty(property)

    @GetMapping("/configProps")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get config props",
        description = "Equivalent call to actuator configProps /configProps",
    )
    @ApiResponse(responseCode = "200", description = "Config props object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun configProps(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).configProps()

    @GetMapping("/flyway")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get flyway",
        description = "Equivalent call to actuator flyway /flyway",
    )
    @ApiResponse(responseCode = "200", description = "Flyway object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun flyway(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).flyway()

    @GetMapping("/liquibase")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get liquibase",
        description = "Equivalent call to actuator liquibase /liquibase",
    )
    @ApiResponse(responseCode = "200", description = "Liquibase object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun liquibase(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).liquibase()

    @GetMapping("/threadDump")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get thread dump",
        description = "Equivalent call to actuator threadDump /threadDump",
    )
    @ApiResponse(responseCode = "200", description = "Thread dump object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun threadDump(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).threadDump()

    @GetMapping("/heapDump")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get heap dump",
        description = "Equivalent call to actuator heapDump /heapDump",
    )
    @ApiResponse(responseCode = "200", description = "Heap dump object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun heapDump(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).heapDump()

    @GetMapping("/loggers")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get loggers",
        description = "Equivalent call to actuator loggers /loggers",
    )
    @ApiResponse(responseCode = "200", description = "Loggers object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun loggers(@RequestParam instanceId: UUID) = getActuatorClient(instanceId).loggers()

    @GetMapping("/loggers/{loggerOrGroupName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific logger",
        description = "Equivalent call to actuator loggers /loggers/{name}",
    )
    @ApiResponse(responseCode = "200", description = "Logger object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun logger(@RequestParam instanceId: UUID, @PathVariable loggerOrGroupName: String) = getActuatorClient(instanceId).logger(loggerOrGroupName)

    @PostMapping("/loggers/{loggerOrGroupName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update specific logger",
        description = "Equivalent call to actuator loggers /loggers/{name}",
    )
    @ApiResponse(responseCode = "200", description = "Logger object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
fun updateLogger(@RequestParam instanceId: UUID, @PathVariable loggerOrGroupName: String, @RequestParam logLevel: LogLevel) = getActuatorClient(instanceId).updateLogger(loggerOrGroupName, logLevel)

    private fun getActuatorClient(instanceId: UUID): ActuatorHttpClient {
        val instance = crudHandler
            .show(instanceId, Instance::class.java)
            .applyPolicies()
            .execute() ?: throw ResourceNotFoundException(Instance.NAME, instanceId)
        return ActuatorHttpClient(instance.actuatorUrl)
    }
}