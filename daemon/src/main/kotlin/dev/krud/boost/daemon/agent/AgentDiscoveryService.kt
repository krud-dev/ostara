package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.DiscoveredInstanceDTO
import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.utils.ONE_MINUTE
import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.boost.daemon.utils.ResultAggregationSummary.Companion.aggregate
import dev.krud.boost.daemon.utils.runFeignCatching
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.*

@Component
class AgentDiscoveryService(
    private val agentService: AgentService,
    private val applicationService: ApplicationService,
    private val agentClientProvider: AgentClientProvider,
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>
) {
    @Scheduled(fixedRate = ONE_MINUTE)
    fun runDiscovery(): ResultAggregationSummary<Unit> {
        val applications = applicationKrud
            .searchByFilter {
                where {
                    Application::agentId.isNotNull()
                    Application::agentDiscoveryType.isNotNull()
                }
            }
        val results = applications.map { application ->
            runDiscoveryForApplication(application)
        }
        return results.aggregate()
    }


    fun runDiscoveryForApplication(applicationId: UUID) = runCatching {
        val application = applicationService.getApplicationOrThrow(applicationId)
        runDiscoveryForApplication(application).getOrThrow()
    }

    fun runDiscoveryForApplication(application: Application) = runCatching {
        if (application.agentId == null || application.agentDiscoveryType == null) {
            throwBadRequest("Agent or discovery type not set for application ${application.id}")
        }
        val discoveredInstances = discoverInstances(application.agentId!!, application.agentDiscoveryParams ?: emptyMap(), application.agentDiscoveryType!!)
            .getOrNull() // todo: do something with the error
            ?: return@runCatching
        val discoveredInstanceIds = discoveredInstances.map { it.id }

        instanceKrud.deleteByFilter {
            where {
                Instance::parentApplicationId Equal application.id
                if (discoveredInstanceIds.isNotEmpty()) {
                    Instance::agentDiscoveryId NotIn discoveredInstances.map { it.id }
                }
            }
        }

        val updatedIds = mutableListOf<String>()
        instanceKrud.updateByFilter(applyPolicies = false, {
            where {
                Instance::parentApplicationId Equal application.id
                Instance::agentDiscoveryId In discoveredInstances.map { it.id }
            }
        }, {
            val discoveredInstance = discoveredInstances.first { it.id == this.agentDiscoveryId }
            this.alias = discoveredInstance.name
            this.actuatorUrl = discoveredInstance.url ?: ""
            updatedIds.add(discoveredInstance.id)
        })

        val instancesToCreate = discoveredInstances
            .filter { it.id !in updatedIds }
            .map {
                Instance(it.name, it.url ?: "", application.id).apply {
                    this.agentDiscoveryId = it.id
                }
            }
        if (instancesToCreate.isNotEmpty()) {
            instanceKrud.bulkCreate(instancesToCreate, false)
        }
    }

    fun discoverInstances(agentId: UUID, params: Map<String, String?>, type: String): Result<List<DiscoveredInstanceDTO>> = runCatching {
        val agent = agentService.getAgentOrThrow(agentId)
        discoverInstances(agent, params, type).getOrThrow()
    }

    fun discoverInstances(agent: Agent, params: Map<String, String?>, type: String): Result<List<DiscoveredInstanceDTO>> = runFeignCatching {
        agentClientProvider.getAgentClient(agent)
            .discoverInstances(params, type)
    }
}