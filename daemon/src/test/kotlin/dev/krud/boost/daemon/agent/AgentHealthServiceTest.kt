package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.utils.resolve
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import strikt.api.expect
import strikt.assertions.isEqualTo
import strikt.assertions.isNull

class AgentHealthServiceTest {
    private val cacheManager = ConcurrentMapCacheManager("agentHealthCache")
    private val agentHealthService = AgentHealthService(
        mock(),
        mock(),
        cacheManager,
        mock(),
        mock(),
        mock(),
    )
    private val agentHealthCache by cacheManager.resolve()

    @Test
    fun `getCachedHealth should return null if value is not cached`() {
        val agent = stubAgent()
        val cachedHealth = agentHealthService.getCachedHealth(agent.id)
        expect {
            that(cachedHealth).isNull()
        }
    }

    @Test
    fun `getCachedHealth should return cached value if value is cached`() {
        val agent = stubAgent()
        val health = AgentHealthDTO.pending()
        agentHealthCache.put(agent.id, health)
        val cachedHealth = agentHealthService.getCachedHealth(agent.id)
        expect {
            that(cachedHealth).isEqualTo(health)
        }
    }
}