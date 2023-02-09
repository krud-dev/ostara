package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.cache.InstanceCacheService
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO
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
    private val instanceCacheService: InstanceCacheService
) {
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
    @ApiResponse(responseCode = "200", description = "List of actuator endpoints")
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
}