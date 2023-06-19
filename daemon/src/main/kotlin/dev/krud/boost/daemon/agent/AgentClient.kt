package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.agent.model.DiscoveredInstanceDTO
import feign.Headers
import feign.Param
import feign.RequestLine
import io.swagger.v3.oas.annotations.parameters.RequestBody

interface AgentClient {
    @RequestLine("GET /api/info")
    fun getAgentInfo(): AgentInfoDTO

    @RequestLine("POST /api/service-discovery/{type}/discover")
    @Headers("Content-Type: application/json")
    fun discoverInstances(@RequestBody params: Map<String, String?>, @Param("type") type: String): List<DiscoveredInstanceDTO>
}