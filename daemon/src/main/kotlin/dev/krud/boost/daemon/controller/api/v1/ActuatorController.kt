package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/actuator")
@Tag(name = "Actuator", description = "Actuator Passthrough API")
class ActuatorController(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {
    @PostMapping("/testConnection")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Test Connection",
        description = "Test the connection to a given URL"
    )
    @ApiResponse(responseCode = "200", description = "Connection successful")
    @ApiResponse(responseCode = "500", description = "Test Connection failed", content = [Content()])
    fun testConnection(@RequestParam url: String, @RequestParam(required = false, defaultValue = "false") disableSslVerification: Boolean, @RequestBody(required = false) authentication: Authentication?) = actuatorClientProvider.provideForUrl(url, authentication = authentication ?: Authentication.None.DEFAULT, disableSslVerification).testConnection()

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get actuator endpoints",
        description = "Equivalent call to actuator root /"
    )
    @ApiResponse(responseCode = "200", description = "List of actuator endpoints")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun endpoints(@RequestParam instanceId: UUID) = getClient(instanceId).endpoints().getOrThrow()

    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get health status",
        description = "Equivalent call to actuator health /health"
    )
    @ApiResponse(responseCode = "200", description = "Health object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun health(@RequestParam instanceId: UUID) = getClient(instanceId).health().getOrThrow()

    @GetMapping("/health/{component}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get health status of a component",
        description = "Equivalent call to actuator health /health/{component}"
    )
    @ApiResponse(responseCode = "200", description = "Health object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun healthComponent(@RequestParam instanceId: UUID, @PathVariable component: String) = getClient(instanceId).healthComponent(component).getOrThrow()

    @GetMapping("/info")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get info",
        description = "Equivalent call to actuator info /info"
    )
    @ApiResponse(responseCode = "200", description = "Info object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun info(@RequestParam instanceId: UUID) = getClient(instanceId).info().getOrThrow()

    @GetMapping("/caches")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get caches",
        description = "Equivalent call to actuator caches /caches"
    )
    @ApiResponse(responseCode = "200", description = "Caches list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun caches(@RequestParam instanceId: UUID) = getClient(instanceId).caches().getOrThrow()

    @GetMapping("/caches/{cache}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific cache",
        description = "Equivalent call to actuator caches /caches/{cache}"
    )
    @ApiResponse(responseCode = "200", description = "Cache object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun cache(@RequestParam instanceId: UUID, @PathVariable cache: String) = getClient(instanceId).cache(cache).getOrThrow()

    @DeleteMapping("/caches")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict all caches",
        description = "Equivalent call to actuator DELETE /caches"
    )
    @ApiResponse(responseCode = "204", description = "Caches cleared")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun evictAllCaches(@RequestParam instanceId: UUID) = getClient(instanceId).evictAllCaches().getOrThrow()

    @DeleteMapping("/caches/{cache}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict specific cache",
        description = "Equivalent call to actuator DELETE /caches/{cache}"
    )
    @ApiResponse(responseCode = "204", description = "Cache cleared")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun evictCache(@RequestParam instanceId: UUID, @PathVariable cache: String) = getClient(instanceId).evictCache(cache).getOrThrow()

    @GetMapping("/beans")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get beans",
        description = "Equivalent call to actuator beans /beans"
    )
    @ApiResponse(responseCode = "200", description = "Beans list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun beans(@RequestParam instanceId: UUID) = getClient(instanceId).beans().getOrThrow()

    @GetMapping("/mappings")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get mappings",
        description = "Equivalent call to actuator mappings /mappings"
    )
    @ApiResponse(responseCode = "200", description = "Mappings list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun mappings(@RequestParam instanceId: UUID) = getClient(instanceId).mappings().getOrThrow()

    @GetMapping("/logfile")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get logfile",
        description = "Equivalent call to actuator logfile /logfile"
    )
    @ApiResponse(responseCode = "200", description = "Logfile content")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun logfile(@RequestParam instanceId: UUID, @RequestParam(required = false) start: Long?, @RequestParam(required = false) end: Long?) = getClient(instanceId).logfile(start, end).getOrThrow()

    @GetMapping("/metrics")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get metrics",
        description = "Equivalent call to actuator metrics /metrics"
    )
    @ApiResponse(responseCode = "200", description = "Metrics list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun metrics(@RequestParam instanceId: UUID) = getClient(instanceId).metrics().getOrThrow()

    @PostMapping("/metrics/{metric}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific metric",
        description = "Equivalent call to actuator metrics /metrics/{metric}"
    )
    @ApiResponse(responseCode = "200", description = "Metric object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun metric(@RequestParam instanceId: UUID, @PathVariable metric: String, @RequestBody(required = false) tags: Map<String, String>?) = getClient(instanceId).metric(metric, tags ?: emptyMap()).getOrThrow()

    @GetMapping("/shutdown")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Shutdown the application",
        description = "Equivalent call to actuator shutdown /shutdown"
    )
    @ApiResponse(responseCode = "200", description = "Shutdown successful")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun shutdown(@RequestParam instanceId: UUID) = getClient(instanceId).shutdown().getOrThrow()

    @GetMapping("/env")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get environment",
        description = "Equivalent call to actuator env /env"
    )
    @ApiResponse(responseCode = "200", description = "Environment object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun env(@RequestParam instanceId: UUID) = getClient(instanceId).env().getOrThrow()

    @GetMapping("/env/{property}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific environment property",
        description = "Equivalent call to actuator env /env/{property}"
    )
    @ApiResponse(responseCode = "200", description = "Environment property object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun envProperty(@RequestParam instanceId: UUID, @PathVariable property: String) = getClient(instanceId).envProperty(property).getOrThrow()

    @GetMapping("/configProps")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get config props",
        description = "Equivalent call to actuator configProps /configProps"
    )
    @ApiResponse(responseCode = "200", description = "Config props object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun configProps(@RequestParam instanceId: UUID) = getClient(instanceId).configProps().getOrThrow()

    @GetMapping("/flyway")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get flyway",
        description = "Equivalent call to actuator flyway /flyway"
    )
    @ApiResponse(responseCode = "200", description = "Flyway object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun flyway(@RequestParam instanceId: UUID) = getClient(instanceId).flyway().getOrThrow()

    @GetMapping("/liquibase")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get liquibase",
        description = "Equivalent call to actuator liquibase /liquibase"
    )
    @ApiResponse(responseCode = "200", description = "Liquibase object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun liquibase(@RequestParam instanceId: UUID) = getClient(instanceId).liquibase().getOrThrow()

    @GetMapping("/threadDump")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get thread dump",
        description = "Equivalent call to actuator threadDump /threadDump"
    )
    @ApiResponse(responseCode = "200", description = "Thread dump object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun threadDump(@RequestParam instanceId: UUID) = getClient(instanceId).threadDump().getOrThrow()

    @GetMapping("/heapDump")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get heap dump",
        description = "Equivalent call to actuator heapDump /heapDump"
    )
    @ApiResponse(responseCode = "200", description = "Heap dump object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun heapDump(@RequestParam instanceId: UUID) = getClient(instanceId).heapDump().getOrThrow()

    @GetMapping("/loggers")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get loggers",
        description = "Equivalent call to actuator loggers /loggers"
    )
    @ApiResponse(responseCode = "200", description = "Loggers object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun loggers(@RequestParam instanceId: UUID) = getClient(instanceId).loggers().getOrThrow()

    @GetMapping("/loggers/{loggerOrGroupName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get specific logger",
        description = "Equivalent call to actuator loggers /loggers/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Logger object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun logger(@RequestParam instanceId: UUID, @PathVariable loggerOrGroupName: String) = getClient(instanceId).logger(loggerOrGroupName).getOrThrow()

    @PostMapping("/loggers/{loggerOrGroupName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update specific logger",
        description = "Equivalent call to actuator loggers /loggers/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Logger object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun updateLogger(@RequestParam instanceId: UUID, @PathVariable loggerOrGroupName: String, @RequestParam logLevel: String) = getClient(instanceId).updateLogger(loggerOrGroupName, logLevel).getOrThrow()

    @GetMapping("/integrationgraph")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get integration graph",
        description = "Equivalent call to actuator integrationgraph /integrationgraph"
    )
    @ApiResponse(responseCode = "200", description = "Integration graph object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun integrationGraph(@RequestParam instanceId: UUID) = getClient(instanceId).integrationGraph().getOrThrow()

    @GetMapping("/scheduledtasks")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get scheduled tasks",
        description = "Equivalent call to actuator scheduledtasks /scheduledtasks"
    )
    @ApiResponse(responseCode = "200", description = "Scheduled tasks object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun scheduledTasks(@RequestParam instanceId: UUID) = getClient(instanceId).scheduledTasks().getOrThrow()

    @GetMapping("/quartz")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz",
        description = "Equivalent call to actuator quartz /quartz"
    )
    @ApiResponse(responseCode = "200", description = "Quartz object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartz(@RequestParam instanceId: UUID) = getClient(instanceId).quartz().getOrThrow()

    @GetMapping("/quartz/jobs")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz jobs",
        description = "Equivalent call to actuator quartz /quartz/jobs"
    )
    @ApiResponse(responseCode = "200", description = "Quartz jobs object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or group not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzJobs(@RequestParam instanceId: UUID) = getClient(instanceId).quartzJobs().getOrThrow()

    @GetMapping("/quartz/jobs/{group}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz jobs by group",
        description = "Equivalent call to actuator quartz /quartz/jobs/{group}"
    )
    @ApiResponse(responseCode = "200", description = "Quartz jobs object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or group not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzJobsByGroup(@RequestParam instanceId: UUID, @PathVariable group: String) = getClient(instanceId).quartzJobsByGroup(group).getOrThrow()

    @GetMapping("/quartz/jobs/{group}/{name}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz job by group and name",
        description = "Equivalent call to actuator quartz /quartz/jobs/{group}/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Quartz job object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or job not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzJob(@RequestParam instanceId: UUID, @PathVariable group: String, @PathVariable name: String) = getClient(instanceId).quartzJob(group, name).getOrThrow()

    @GetMapping("/quartz/triggers")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz triggers",
        description = "Equivalent call to actuator quartz /quartz/triggers"
    )
    @ApiResponse(responseCode = "200", description = "Quartz triggers object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or group not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzTriggers(@RequestParam instanceId: UUID) = getClient(instanceId).quartzTriggers().getOrThrow()

    @GetMapping("/quartz/triggers/{group}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz triggers by group",
        description = "Equivalent call to actuator quartz /quartz/triggers/{group}"
    )
    @ApiResponse(responseCode = "200", description = "Quartz triggers object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or group not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzTriggersByGroup(@RequestParam instanceId: UUID, @PathVariable group: String) = getClient(instanceId).quartzTriggersByGroup(group).getOrThrow()

    @GetMapping("/quartz/triggers/{group}/{name}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get quartz trigger by group and name",
        description = "Equivalent call to actuator quartz /quartz/triggers/{group}/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Quartz trigger object")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or trigger not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun quartzTrigger(@RequestParam instanceId: UUID, @PathVariable group: String, @PathVariable name: String) = getClient(instanceId).quartzTrigger(group, name).getOrThrow()

    @GetMapping("/togglz")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a list of Togglz features",
        description = "Equivalent call to actuator /togglz"
    )
    @ApiResponse(responseCode = "200", description = "Togglz feature list")
    @ApiResponse(responseCode = "404", description = "Endpoint not available", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun togglz(@RequestParam instanceId: UUID) = getClient(instanceId).togglz().getOrThrow()

    @GetMapping("/togglz/{featureName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a Togglz feature by name",
        description = "Equivalent call to actuator /togglz/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Togglz feature")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or feature not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun togglzFeature(@RequestParam instanceId: UUID, @PathVariable featureName: String) = getClient(instanceId).togglzFeature(featureName).getOrThrow()

    @PostMapping("/togglz/{featureName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update a Togglz feature by name",
        description = "Equivalent call to actuator POST /togglz/{name}"
    )
    @ApiResponse(responseCode = "200", description = "Togglz feature")
    @ApiResponse(responseCode = "404", description = "Endpoint not available or feature not found", content = [Content()])
    @ApiResponse(responseCode = "503", description = "Service unavailable", content = [Content()])
    fun updateTogglzFeature(@RequestParam instanceId: UUID, @PathVariable featureName: String, @RequestParam enabled: Boolean) = getClient(instanceId).togglzFeature(featureName).getOrThrow()

    private fun getClient(instanceId: UUID): ActuatorHttpClient {
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        return actuatorClientProvider.provide(instance)
    }
}