package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.application.logger.ApplicationLoggerService
import dev.krud.boost.daemon.configuration.application.logger.ro.ApplicationLoggerRO
import dev.krud.boost.daemon.configuration.instance.logger.InstanceLoggerService
import dev.krud.boost.daemon.configuration.instance.logger.ro.InstanceLoggerRO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/logger")
@Tag(name = "Logger", description = "Logger operations for Instance/Application API")
class LoggerController(
    private val instanceLoggerService: InstanceLoggerService,
    private val applicationLoggerService: ApplicationLoggerService
) {
    /**
     * Instance
     */

    @GetMapping("/instance/{instanceId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all loggers for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Logger list")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getInstanceLoggers(@PathVariable instanceId: UUID): List<InstanceLoggerRO> {
        return instanceLoggerService.getLoggers(instanceId)
    }

    @GetMapping("/instance/{instanceId}/{loggerName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get logger for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Logger")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getInstanceLogger(@PathVariable instanceId: UUID, @PathVariable loggerName: String): InstanceLoggerRO {
        return instanceLoggerService.getLogger(instanceId, loggerName)
    }

    @PutMapping("/instance/{instanceId}/{loggerName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update logger for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Updated logger")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun updateInstanceLogger(@PathVariable instanceId: UUID, @PathVariable loggerName: String, @RequestParam(required = false) level: String? = null): InstanceLoggerRO {
        return instanceLoggerService.setLoggerLevel(instanceId, loggerName, level)
    }

    /**
     * Application
     */

    @GetMapping("/application/{applicationId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all loggers for the application"
    )
    @ApiResponse(responseCode = "200", description = "Logger list")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun getApplicationLoggers(@PathVariable applicationId: UUID): List<ApplicationLoggerRO> {
        return applicationLoggerService.getLoggers(applicationId)
    }

    @GetMapping("/application/{applicationId}/{loggerName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get logger for the application"
    )
    @ApiResponse(responseCode = "200", description = "Logger")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun getApplicationLogger(@PathVariable applicationId: UUID, @PathVariable loggerName: String): ApplicationLoggerRO {
        return applicationLoggerService.getLogger(applicationId, loggerName)
    }

    @PutMapping("/application/{applicationId}/{loggerName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update logger for the application"
    )
    @ApiResponse(responseCode = "200", description = "Updated logger")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun updateApplicationLogger(@PathVariable applicationId: UUID, @PathVariable loggerName: String, @RequestParam(required = false) level: String? = null): ApplicationLoggerRO {
        return applicationLoggerService.setLoggerLevel(applicationId, loggerName, level)
    }
}