package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.utils.ONE_MINUTE
import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.boost.daemon.utils.ResultAggregationSummary.Companion.aggregate
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.*

@Component
class AgentDiscoveryService(
    private val agentService: AgentService,
    private val agentHealthService: AgentHealthService,
    private val agentClientProvider: AgentClientProvider,
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>,
    private val agentKrud: Krud<Agent, UUID>
) {
    @Scheduled(fixedRate = ONE_MINUTE)
    fun runDiscovery(): ResultAggregationSummary<Unit> {
        val agents = agentKrud.searchByFilter { }
        val results = agents.map { agent ->
            runDiscoveryForAgent(agent)
        }
        return results.aggregate()
    }


    fun runDiscoveryForAgent(agentId: UUID) = runCatching {
        val agent = agentService.getAgentOrThrow(agentId)
        runDiscoveryForAgent(agent).getOrThrow()
    }

    fun runDiscoveryForAgent(agent: Agent) = runCatching {
        val agentHealth = agentHealthService.getCachedHealth(agent.id)
        if (agentHealth?.status != AgentHealthDTO.Companion.Status.HEALTHY) {
            log.debug { "Skipping discovery for agent ${agent.id} because it is not healthy" }
            return@runCatching
        }
        log.debug { "Running discovery for agent ${agent.id}" }
        val client = agentClientProvider.getAgentClient(agent)
        val instances = client.getInstances(agent.apiKey)
        log.debug { "Discovered ${instances.size} instances for agent ${agent.id}" }
        val instancesByApplications = instances.groupBy { it.appName }
        log.debug { "Discovered ${instancesByApplications.size} applications for agent ${agent.id}" }
        instancesByApplications.forEach {
            (appName, instances) ->
            log.debug { "Processing application $appName with ${instances.size} instances for agent ${agent.id}" }
            var isNewApplication = false
            val application = applicationKrud.showByFilter {
                where {
                    Application::parentAgentId Equal agent.id
                    Application::agentExternalId Equal appName
                }
            } ?: applicationKrud.create(Application(appName, type = ApplicationType.SPRING_BOOT, parentAgentId = agent.id, agentExternalId = appName))
                .apply {
                    isNewApplication = true
                }
            log.debug {
                if (isNewApplication) {
                    "Created new application ${application.id} for agent ${agent.id}"
                } else {
                    "Found existing application ${application.id} for agent ${agent.id}"
                }
            }
            val updatedIds = mutableListOf<String>()
            if (!isNewApplication) {
                log.debug { "Updating instances for application ${application.id} for agent ${agent.id}" }
                instanceKrud.updateByFilter(applyPolicies = false, {
                    where {
                        Instance::parentAgentId Equal agent.id
                        Instance::parentApplicationId Equal application.id
                        Instance::agentExternalId In instances.map { it.id }
                    }
                }, {
                    val discoveredInstance = instances.first { it.id == this.agentExternalId }
                    this.alias = discoveredInstance.name
                    this.actuatorUrl = discoveredInstance.url ?: ""
                    this.agentExternalId = discoveredInstance.id
                    updatedIds.add(discoveredInstance.id)
                })
            }
            log.debug { "Creating new instances for application ${application.id} for agent ${agent.id}" }
            val instancesToCreate = instances
                .filter { it.id !in updatedIds }
                .map {
                    Instance(it.name, it.url ?: "", application.id).apply {
                        this.parentAgentId = agent.id
                        this.agentExternalId = it.id
                    }
                }
            if (instancesToCreate.isNotEmpty()) {
                instanceKrud.bulkCreate(instancesToCreate, false)
            }
        }

        log.debug { "Deleting instances for agent ${agent.id} that are not present in discovery" }
        instanceKrud.deleteByFilter {
            where {
                Instance::parentAgentId Equal agent.id
                if (instances.isNotEmpty()) {
                    Instance::agentExternalId NotIn instances.map { it.id }
                }
            }
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}