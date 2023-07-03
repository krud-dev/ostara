package dev.krud.boost.daemon.configuration.agent.authentication

import dev.krud.boost.daemon.agent.AgentService
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.authentication.FolderAuthenticationService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class AgentAuthenticationService(
    private val agentService: AgentService,
    private val folderAuthenticationService: FolderAuthenticationService
) {
    @Cacheable(cacheNames = ["agentEffectiveAuthenticationCache"], key = "#agentId")
    fun getEffectiveAuthentication(agentId: UUID): EffectiveAuthentication {
        log.debug { "Getting effective authentication for agent $agentId" }
        val agent = agentService.getAgentOrThrow(agentId)
        if (agent.authentication !is Authentication.Inherit) {
            val effectiveAuthentication = EffectiveAuthentication(agent.authentication, EffectiveAuthentication.SourceType.AGENT, agentId)
            log.debug { "Agent $agentId has its own authentication ${agent.authentication}, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        if (agent.parentFolderId == null) {
            val effectiveAuthentication = EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.AGENT, agentId)
            log.debug { "Agent $agentId has no parent folder, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        log.debug { "Agent $agentId inherits authentication from folder ${agent.parentFolderId}, fetching parent effective authentication" }
        return folderAuthenticationService.getEffectiveAuthentication(agent.parentFolderId!!)
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}