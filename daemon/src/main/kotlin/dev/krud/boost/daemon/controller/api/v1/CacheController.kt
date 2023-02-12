package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.application.cache.ApplicationCacheService
import dev.krud.boost.daemon.configuration.application.cache.ro.ApplicationCacheRO
import dev.krud.boost.daemon.configuration.application.cache.ro.ApplicationCacheStatisticsRO
import dev.krud.boost.daemon.configuration.instance.cache.InstanceCacheService
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheStatisticsRO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/cache")
@Tag(name = "Cache", description = "Cache operations for Instance/Application API")
class CacheController(
    private val instanceCacheService: InstanceCacheService,
    private val applicationCacheService: ApplicationCacheService
) {
    /**
     * Instance
     */

    @GetMapping("/instance/{instanceId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all caches for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Cache list")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getInstanceCaches(@PathVariable instanceId: UUID): List<InstanceCacheRO> {
        return instanceCacheService.getCaches(instanceId)
    }

    @GetMapping("/instance/{instanceId}/{cacheName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get cache for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Cache")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getInstanceCache(@PathVariable instanceId: UUID, @PathVariable cacheName: String): InstanceCacheRO {
        return instanceCacheService.getCache(instanceId, cacheName)
    }

    @DeleteMapping("/instance/{instanceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict all caches for the instance"
    )
    @ApiResponse(responseCode = "204", description = "Caches evicted")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun evictInstanceCaches(@PathVariable instanceId: UUID) {
        instanceCacheService.evictAllCaches(instanceId)
    }

    @DeleteMapping("/instance/{instanceId}/{cacheName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict cache for the instance"
    )
    @ApiResponse(responseCode = "204", description = "Cache evicted")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun evictInstanceCache(@PathVariable instanceId: UUID, @PathVariable cacheName: String) {
        instanceCacheService.evictCache(instanceId, cacheName)
    }

    @GetMapping("/instance/{instanceId}/{cacheName}/statistics")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get cache statistics for the instance"
    )
    @ApiResponse(responseCode = "200", description = "Cache statistics")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getInstanceCacheStatistics(
        @PathVariable instanceId: UUID,
        @PathVariable cacheName: String
    ): InstanceCacheStatisticsRO {
        return instanceCacheService.getCacheStatistics(instanceId, cacheName)
    }

    /**
     * Application
     */

    @GetMapping("/application/{applicationId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all caches for the application"
    )
    @ApiResponse(responseCode = "200", description = "Cache list")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun getApplicationCaches(@PathVariable applicationId: UUID): List<ApplicationCacheRO> {
        return applicationCacheService.getCaches(applicationId)
    }

    @GetMapping("/application/{applicationId}/{cacheName}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get cache for the application"
    )
    @ApiResponse(responseCode = "200", description = "Cache")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun getApplicationCache(@PathVariable applicationId: UUID, @PathVariable cacheName: String): ApplicationCacheRO {
        return applicationCacheService.getCache(applicationId, cacheName)
    }

    @DeleteMapping("/application/{applicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict all caches for the application"
    )
    @ApiResponse(responseCode = "204", description = "Caches evicted")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun evictApplicationCaches(@PathVariable applicationId: UUID) {
        applicationCacheService.evictAllCaches(applicationId)
    }

    @DeleteMapping("/application/{applicationId}/{cacheName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Evict cache for the application"
    )
    @ApiResponse(responseCode = "204", description = "Cache evicted")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun evictApplicationCache(@PathVariable applicationId: UUID, @PathVariable cacheName: String) {
        applicationCacheService.evictCache(applicationId, cacheName)
    }

    @GetMapping("/application/{applicationId}/{cacheName}/statistics")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get cache statistics for the application"
    )
    @ApiResponse(responseCode = "200", description = "Cache statistics")
    @ApiResponse(responseCode = "400", description = "Application is missing ability", content = [Content()])
    fun getApplicationCacheStatistics(
        @PathVariable applicationId: UUID,
        @PathVariable cacheName: String
    ): ApplicationCacheStatisticsRO {
        return applicationCacheService.getCacheStatistics(applicationId, cacheName)
    }
}