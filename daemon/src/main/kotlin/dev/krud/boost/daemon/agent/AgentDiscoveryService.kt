package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.utils.ONE_MINUTE
import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.boost.daemon.utils.ResultAggregationSummary.Companion.aggregate
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.*

@Component
class AgentDiscoveryService(
    private val agentService: AgentService,
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
        val client = agentClientProvider.getAgentClient(agent)
        val instances = client.getInstances()
        val instancesByApplications = instances.groupBy { it.appName }
        instancesByApplications.forEach {
            (appName, instances) ->
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
            val updatedIds = mutableListOf<String>()
            if (!isNewApplication) {
                instanceKrud.deleteByFilter {
                    where {
                        Instance::parentAgentId Equal agent.id
                        Instance::parentApplicationId Equal application.id
                        if (instances.isNotEmpty()) {
                            Instance::agentExternalId NotIn instances.map { it.id }
                        }
                    }
                }
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
    }
}