package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.agent.model.DiscoveredInstanceDTO
import feign.Headers
import feign.Param
import feign.RequestLine
import org.springframework.http.ResponseEntity

interface AgentClient {
    @RequestLine("GET /api/v1")
    @Headers("$AGENT_KEY_HEADER: {apiKey}")
    fun getAgentInfo(@Param("apiKey") apiKey: String?): AgentInfoDTO

    @RequestLine("GET /api/v1/instances")
    @Headers("$AGENT_KEY_HEADER: {apiKey}")
    fun getInstances(@Param("apiKey") apiKey: String?): List<DiscoveredInstanceDTO>

    companion object {
        const val AGENT_KEY_HEADER = "X-Ostara-Key"
    }
}